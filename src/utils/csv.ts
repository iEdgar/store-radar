export interface CsvColumn<T> {
  header: string;
  value: (row: T) => string | number;
}

const UTF8_BOM = String.fromCharCode(0xfeff);

/**
 * Field delimiter. We use ";" because Excel in many locales (es, most of EU)
 * expects it as the list separator; combined with the `sep=` hint below, this
 * makes the file open in proper columns regardless of the user's locale.
 */
const DELIMITER = ";";

function escapeCsvCell(value: string | number): string {
  if (typeof value === "number") {
    return String(value);
  }

  // Guard against CSV/formula injection in spreadsheet apps.
  const guarded = /^[=+\-@\t\r]/.test(value) ? `'${value}` : value;

  // Quote when the cell contains the delimiter, a double quote or a line break.
  if (guarded.includes(DELIMITER) || /["\n\r]/.test(guarded)) {
    return `"${guarded.replace(/"/g, '""')}"`;
  }
  return guarded;
}

/** Serializes rows into a CSV string (CRLF line endings, RFC-4180 style). */
export function toCsv<T>(columns: CsvColumn<T>[], rows: T[]): string {
  const headerLine = columns
    .map((column) => escapeCsvCell(column.header))
    .join(DELIMITER);
  const dataLines = rows.map((row) =>
    columns.map((column) => escapeCsvCell(column.value(row))).join(DELIMITER),
  );
  return [headerLine, ...dataLines].join("\r\n");
}

/** Triggers a client-side download of `csv` as a UTF-8 .csv file. */
export function downloadCsv(filename: string, csv: string): void {
  // BOM for UTF-8 detection + `sep=` hint so Excel splits on our delimiter in
  // any locale (otherwise comma/semicolon mismatch dumps everything in one cell).
  const content = `${UTF8_BOM}sep=${DELIMITER}\r\n${csv}`;
  const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}
