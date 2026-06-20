export interface CsvColumn<T> {
  header: string;
  value: (row: T) => string | number;
}

function escapeCsvCell(value: string | number): string {
  if (typeof value === "number") {
    return String(value);
  }

  // Guard against CSV/formula injection in spreadsheet apps.
  const guarded = /^[=+\-@\t\r]/.test(value) ? `'${value}` : value;

  // Quote when the cell contains a comma, double quote or line break.
  if (/[",\n\r]/.test(guarded)) {
    return `"${guarded.replace(/"/g, '""')}"`;
  }
  return guarded;
}

/** Serializes rows into a CSV string (CRLF line endings, RFC-4180 style). */
export function toCsv<T>(columns: CsvColumn<T>[], rows: T[]): string {
  const headerLine = columns.map((column) => escapeCsvCell(column.header));
  const dataLines = rows.map((row) =>
    columns.map((column) => escapeCsvCell(column.value(row))).join(","),
  );
  return [headerLine.join(","), ...dataLines].join("\r\n");
}

/** Triggers a client-side download of `csv` as a UTF-8 .csv file. */
const UTF8_BOM = String.fromCharCode(0xfeff);

export function downloadCsv(filename: string, csv: string): void {
  // Prepend a BOM so spreadsheet apps detect UTF-8 correctly.
  const blob = new Blob([UTF8_BOM, csv], {
    type: "text/csv;charset=utf-8;",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}
