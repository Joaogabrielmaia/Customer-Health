const needsQuote = /[",\n\r]/;

export function toCsv(headers: string[], rows: (string | number | null)[][]): string {
  const cell = (v: string | number | null): string => {
    if (v === null) return "";
    const s = String(v);
    return needsQuote.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  // BOM para o Excel/Power BI reconhecerem UTF-8
  return "﻿" + [headers, ...rows].map((r) => r.map(cell).join(",")).join("\r\n") + "\r\n";
}
