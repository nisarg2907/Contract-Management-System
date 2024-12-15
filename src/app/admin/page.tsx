"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { CustomFilterComponentProps, DataTable } from "@/components/ui/dataTable/dataTable";
import { SearchInputGlobalFilter } from "@/components/ui/dataTable/SearchInputGlobalFilter";
import { ColumnDef, PaginationState } from "@tanstack/react-table";
import { useRouter } from "next/navigation";
import DropdownActionsMenu from "@/components/ui/dropdownActionMenus";
import { DataTableColumnHeader } from "@/components/ui/dataTable/columnHeader";
import { toast } from "react-toastify";
import { ContractDataTableRow } from "@/types/contract";
import { usePagination } from "@/hooks/use-pagination";
import { MultiSelect } from "@/components/ui/multiSelect";
import { ContractStatus, ContractType } from "@prisma/client";
import { Input } from "@/components/ui/input";

// Helper function to transform enum to select options
const transformEnumToOptions = <T extends Record<string, string>>(enumObj: T) => 
    Object.values(enumObj).map((value) => ({
        label: value,
        value: value,
    }));

const ContractStatuses = transformEnumToOptions(ContractStatus);
const ContractTypes = transformEnumToOptions(ContractType);

function useContractGet(
    searchQuery: string, 
    selectedTypes: ContractType[], 
    selectedStatuses: ContractStatus[], 
    pagination: PaginationState
) {
    const [data, setData] = useState<ContractDataTableRow[]>([]);
    const [rowCount, setRowCount] = useState<number>(0);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchContracts = async () => {
        try {
            setIsLoading(true);
            const response = await axios.get("/api/contract", {
                params: {
                    page: pagination.pageIndex + 1,
                    pageSize: pagination.pageSize,
                    searchQuery,
                    types: selectedTypes,
                    statuses: selectedStatuses,
                },
            });

            setData(response.data.data.contracts);
            setRowCount(response.data.data.totalPages || response.data.data.contracts.length);
        } catch {
            setError("Error fetching contracts");
            toast.error("Error fetching contracts");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchContracts();
        
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pagination.pageIndex, pagination.pageSize, searchQuery, selectedTypes, selectedStatuses]);

    return { data, rowCount, isLoading, error, refetch: fetchContracts };
}

type cFilterClosureProps = {
    searchQuery: string;
    setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
    selectedTypes: ContractType[];
    setSelectedTypes: React.Dispatch<React.SetStateAction<ContractType[]>>;
    selectedStatuses: ContractStatus[];
    setSelectedStatuses: React.Dispatch<React.SetStateAction<ContractStatus[]>>;
    onAddContract: () => void;
};

const cFilterClosure = ({
    searchQuery,
    setSearchQuery,
    selectedTypes,
    setSelectedTypes,
    selectedStatuses,
    setSelectedStatuses,
    onAddContract,
}: cFilterClosureProps) => {
    const CFilter: React.FC<CustomFilterComponentProps> = (props) => {
        const [searchQueryLocal, setSearchQueryLocal] = useState<string>(searchQuery);

        return (
            <SearchInputGlobalFilter isGlobalFilter={false} {...props}>
                <>
                    <div className="flex flex-row items-center w-full gap-4">
                        <Input
                            placeholder="Search contracts..."
                            value={searchQueryLocal}
                            onChange={(e) => setSearchQueryLocal(e.target.value)}
                        />
                        <Button
                            onClick={() => setSearchQuery(searchQueryLocal)}
                            variant="secondary"
                            className="border"
                            size="default"
                        >
                            Search
                        </Button>
                        <Button
                            onClick={() => {
                                setSearchQuery("");
                                setSearchQueryLocal("");
                            }}
                            variant="secondary"
                            className="border"
                            size="default"
                        >
                            Reset
                        </Button>
                        <MultiSelect
                            options={ContractStatuses}
                            placeholder="Select Statuses"
                            onValueChange={(values) => setSelectedStatuses(values as ContractStatus[])}
                            defaultValue={selectedStatuses}
                            maxCount={5}
                        />
                        <MultiSelect
                            options={ContractTypes}
                            placeholder="Select Types"
                            onValueChange={(values) => setSelectedTypes(values as ContractType[])}
                            defaultValue={selectedTypes}
                            maxCount={5}
                        />
                        <Button
                            onClick={onAddContract}
                            variant="secondary"
                            className="border"
                            size="default"
                        >
                            Add 
                        </Button>
                    </div>
                </>
            </SearchInputGlobalFilter>
        );
    };
    return CFilter;
};

export default function Contracts() {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [selectedTypes, setSelectedTypes] = useState<ContractType[]>([]);
    const [selectedStatuses, setSelectedStatuses] = useState<ContractStatus[]>([]);
    const { pagination, onPaginationChange } = usePagination();

    const { data, rowCount, refetch } = useContractGet(
        searchQuery, 
        selectedTypes, 
        selectedStatuses, 
        pagination
    );

    const deleteContract = async (id: string) => {
        try {
            await axios.delete(`/api/contract?id=${id}`);
            toast.success("Contract deleted successfully");
            refetch();
        } catch {
            toast.error("Error deleting contract");
        }
    };

    const handleAddContract = () => {
        router.push('/admin/modify/new');
    };

    const columns: ColumnDef<ContractDataTableRow>[] = [
        {
            id: "index",
            header: "No.",
            cell: (info) => info.row.index + 1,
        },
        {
            accessorKey: "title",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Title" />
            ),
        },
        {
            accessorKey: "clientName",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Client Name" />
            ),
        },
        {
            accessorKey: "status",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Status" />
            ),
        },
        {
            accessorKey: "type",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Type" />
            ),
        },
        {
            id: "actions",
            cell: ({ row }) => {
                const contract = row.original;
                const actions = [
                    {
                        name: "Delete",
                        onClick: () => deleteContract(contract.id),
                        requiresConfirmation: true,
                    },
                    {
                        name: "Edit",
                        onClick: () => router.push(`/admin/modify/${contract.id}`),
                    },
                ];
                return <DropdownActionsMenu actions={actions} />;
            },
        },
    ];

    return (
        <div className="p-4 m-4">
            <DataTable
                columns={columns}
                data={data}
                pagination={pagination}
                totalRows={rowCount}
                onPaginationChange={onPaginationChange}
                CustomFilterComponent={cFilterClosure({
                    searchQuery,
                    setSearchQuery,
                    selectedTypes,
                    setSelectedTypes,
                    selectedStatuses,
                    setSelectedStatuses,
                    onAddContract: handleAddContract,
                })}
            />
        </div>
    );
}