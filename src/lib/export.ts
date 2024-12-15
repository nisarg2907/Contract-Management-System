import { Table } from "@tanstack/react-table";

export function exportTableToCSV<TData>(
    /**
     * The table or data to export.
     * @type Table<TData> | TData[]
     */
    tableOrData: Table<TData> | TData[],
    opts: {
        /**
         * The filename for the CSV file.
         * @default "table"
         * @example "tasks"
         */
        filename?: string;
        /**
         * The columns to exclude from the CSV file.
         * @default []
         * @example ["select", "actions"]
         */
        excludeColumns?: (keyof TData | "select" | "actions")[];

        /**
         * Whether to export only the selected rows.
         * @default false
         */
        onlySelected?: boolean;
    } = {},
): void {
    const {
        filename = "table",
        excludeColumns = [],
        onlySelected = false,
    } = opts;

    let headers: string[] = [];
    let rows: TData[] = [];

    const flattenObject = <T>(
        obj: T,
        parentKey = "",
        res: Record<string, unknown> = {},
    ): Record<string, unknown> => {
        for (const key in obj) {
            const propName = parentKey ? `${parentKey}.${key}` : key;
            if (typeof obj[key] === "object" && obj[key] !== null) {
                flattenObject(obj[key], propName, res);
            } else {
                res[propName] = obj[key];
            }
        }
        return res;
    };

    if (Array.isArray(tableOrData)) {
        // If an array of data is passed
        headers = Array.from(
            new Set(
                tableOrData.flatMap((item) => Object.keys(flattenObject(item))),
            ),
        );
        headers = headers.filter(
            (key) =>
                key !== "id" &&
                !excludeColumns.includes(
                    key as keyof TData | "select" | "actions",
                ),
        );
        rows = tableOrData.map((item) => flattenObject(item) as TData);
    } else {
        // If a Table object is passed
        headers = tableOrData
            .getAllLeafColumns()
            .map((column) => column.id)
            .filter(
                (id) =>
                    id !== "id" &&
                    !excludeColumns.includes(
                        id as keyof TData | "select" | "actions",
                    ),
            );
        rows = (
            onlySelected
                ? tableOrData.getFilteredSelectedRowModel().rows
                : tableOrData.getRowModel().rows
        ).map((row) => flattenObject(row.original) as TData);
    }

    // Build CSV content
    const csvContent = [
        headers.join(","),
        ...rows.map((row) =>
            headers
                .map((header) => {
                    const cellValue = row[header as keyof TData];
                    // Handle values that might contain commas or newlines
                    return typeof cellValue === "string"
                        ? `"${cellValue.replace(/"/g, '""')}"`
                        : cellValue;
                })
                .join(","),
        ),
    ].join("\n");

    // Create a Blob with CSV content
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });

    // Create a link and trigger the download
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `${filename}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
