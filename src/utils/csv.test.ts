import { describe, expect, it } from "vitest";

import { toCsv, type CsvColumn } from "@/utils/csv";

interface Row {
  name: string;
  value: number;
}

const columns: CsvColumn<Row>[] = [
  { header: "Name", value: (row) => row.name },
  { header: "Value", value: (row) => row.value },
];

describe("toCsv", () => {
  it("builds a header row followed by data rows", () => {
    expect(toCsv(columns, [{ name: "Mouse", value: 10 }])).toBe(
      "Name,Value\r\nMouse,10",
    );
  });

  it("quotes and escapes fields with commas, quotes or line breaks", () => {
    expect(toCsv(columns, [{ name: 'A, "B"', value: 1 }])).toBe(
      'Name,Value\r\n"A, ""B""",1',
    );
  });

  it("guards string cells against formula injection", () => {
    expect(toCsv(columns, [{ name: "=SUM(A1)", value: 1 }])).toBe(
      "Name,Value\r\n'=SUM(A1),1",
    );
  });

  it("does not alter numeric cells", () => {
    expect(toCsv(columns, [{ name: "Item", value: -5 }])).toBe(
      "Name,Value\r\nItem,-5",
    );
  });
});
