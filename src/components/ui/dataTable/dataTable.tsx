"use client";
import React, {
    Dispatch,
    FC,
    SetStateAction,
    useState,
    useTransition,
} from "react";
import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    Row,
    ColumnFiltersState,
    getFilteredRowModel,
    useReactTable,
    SortingState,
    getSortedRowModel,
    RowSelectionState,
    getPaginationRowModel,
} from "@tanstack/react-table";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { DataTablePagination } from "../dataTable/tablePagination";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { exportTableToCSV } from "@/lib/export"
import { Download, RotateCw } from "lucide-react";
import { DataTableViewOptions } from "./dataTableViewOptions";
import { usePagination } from "@/hooks/use-pagination";

export type CustomFilterComponentProps = {
    globalFilter: string;
    setGlobalFilter: Dispatch<SetStateAction<string>>;
};
type DataTableProps<T> = {
    columns: ColumnDef<T>[];
    data: T[];
    CustomFilterComponent?: FC<CustomFilterComponentProps>;
    filterRequired?: boolean;
    pagination?: ReturnType<typeof usePagination>["pagination"];
    onPaginationChange?: ReturnType<typeof usePagination>["onPaginationChange"];
    getRowProps?: (row: Row<T>) => { className?: string };
    totalRows?: number;
};

export function DataTable<T>({
    columns,
    data,
    CustomFilterComponent = undefined,
    filterRequired = true,
    pagination = undefined,
    onPaginationChange = undefined,
    getRowProps = undefined,
    totalRows = undefined,
}: DataTableProps<T>) {
    const [columnFilters, setColumnFilters] =
        React.useState<ColumnFiltersState>([]);
    const [isPending, startTransition] = useTransition();
    const [sorting, setSorting] = useState<SortingState>([]);
    const [globalFilter, setGlobalFilter] = useState<string>("");
    const [rowSelection] = useState<RowSelectionState>({});
    const {
        pagination: internalPagination,
        onPaginationChange: internalPaginationChange,
    } = usePagination();

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        onColumnFiltersChange: setColumnFilters,
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onPaginationChange: onPaginationChange ?? internalPaginationChange,
        manualPagination: !!onPaginationChange && !!pagination,
        rowCount: totalRows,
        state: {
            sorting,
            globalFilter,
            columnFilters,
            rowSelection,
            pagination: pagination ?? internalPagination,
        },
        onSortingChange: setSorting,
    });

    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center py-4 gap-4">
                {filterRequired && CustomFilterComponent && (
                    <CustomFilterComponent
                        globalFilter={globalFilter}
                        setGlobalFilter={setGlobalFilter}
                    />
                )}

                {filterRequired && !CustomFilterComponent && (
                    <div className="flex items-center w-full gap-4">
                        <Input
                            placeholder="Global Filter...."
                            value={globalFilter}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setGlobalFilter(e.target.value)}
                        />
                    </div>
                )}

                <Button
                    variant="secondary"
                    size="default"
                    className="border"
                    onClick={() => {
                        startTransition(() => {
                            exportTableToCSV(
                                table
                                    .getPrePaginationRowModel()
                                    .rows.map((row) => row.original),
                                {
                                    onlySelected: false,
                                },
                            );
                        });
                    }}
                    disabled={isPending}
                >
                    {isPending ? (
                        <RotateCw
                            className="size-3.5 animate-spin"
                            aria-hidden="true"
                        />
                    ) : (
                        <>
                            <Download className="size-3.5" aria-hidden="true" />
                            <p className="pl-1">Export</p>
                        </>
                    )}
                </Button>
                <DataTableViewOptions table={table} />
            </div>
            <div className="rounded-md border w-full">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id}>
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                header.column.columnDef
                                                    .header,
                                                header.getContext(),
                                            )}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row: Row<T>) => (
                                <TableRow
                                    key={row.id}
                                    {...(getRowProps ? getRowProps(row) : {})} // Apply getRowProps to customize the row
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext(),
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="h-24 text-center"
                                >
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <DataTablePagination table={table} />
        </div>
    );
}