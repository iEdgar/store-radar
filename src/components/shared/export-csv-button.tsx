"use client";

import { Download } from "lucide-react";

import { Button } from "@/components/ui/button";
import { downloadCsv, toCsv, type CsvColumn } from "@/utils/csv";

export interface ExportCsvButtonProps<T> {
  filename: string;
  columns: CsvColumn<T>[];
  rows: T[];
  label?: string;
}

export function ExportCsvButton<T>({
  filename,
  columns,
  rows,
  label = "Export CSV",
}: ExportCsvButtonProps<T>) {
  const handleExport = () => {
    downloadCsv(filename, toCsv(columns, rows));
  };

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={handleExport}
      disabled={rows.length === 0}
    >
      <Download />
      {label}
    </Button>
  );
}
