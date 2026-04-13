/**
 *
 * @param data array of data
 * @param headers array of {header: keyof T, name?: string}. Fixed column order (important!)
 * @param numberCheck array of column name, want to convert number to string (optional)
 * @returns
 */

export const convertToCSV = <T extends Record<string, unknown>>(
  data: T[],
  headers: { header: keyof T; name?: string }[],
  numberCheck?: string[],
  dataFormat?: {
    headerName: string;
    format: (value: unknown) => string;
  }[],
) => {
  if (!Array.isArray(data) || data.length === 0) return "";

  const escapeCSV = (value: unknown) => {
    if (value === null || value === undefined) return "-";

    const stringValue = String(value);
    const escaped = stringValue.replace(/"/g, '""');

    if (/[",\n]/.test(escaped)) {
      return `"${escaped}"`;
    }

    return escaped;
  };

  let csv = headers.map((item) => item.name ? `"${item.name}"` : item.header).join(",") + "\r\n";

  for (const row of data) {
    const line = headers
      .map((header) => {
        const value = row[header.header];
        const formatter = dataFormat?.find(
          (i) => i.headerName === header.header,
        )?.format;

        if (formatter) {
          return String(formatter(value));
        }

        if (numberCheck?.includes(String(header))) {
          return `="${value ?? "-"}"`;
        }

        return escapeCSV(value);
      })
      .join(",");

    csv += line + "\r\n";
  }

  return csv;
};
