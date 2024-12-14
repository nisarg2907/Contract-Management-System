"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/dataTable/dataTable";
import { SearchInputGlobalFilter } from "@/components/ui/dataTable/SearchInputGlobalFilter";
import { ColumnDef } from "@tanstack/react-table";
import { useRouter } from "next/navigation";
import DropdownActionsMenu from "@/components/ui/dropdownActionMenus";
import LoadingScreen from "@/components/ui/loadingScreen";
import { DataTableColumnHeader } from "@/components/ui/dataTable/columnHeader";
import { toast } from "react-toastify";
import { ContractDataTableRow } from "@/types/contract";
import { usePagination } from "@/hooks/use-pagination";

export default function Contracts() {
  const [data, setData] = useState<ContractDataTableRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { pagination, onPaginationChange } = usePagination();
  const [totalPageCount, setTotalPageCount] = useState<number>(0);

  useEffect(() => {
    const fetchContracts = async () => {
      try {
        const response = await axios.get("/api/contract", {
          params: {
            pageIndex: pagination.pageIndex,
            pageSize: pagination.pageSize,
          },
        });
        setData(response.data.data.contracts);
        setTotalPageCount(response.data.data.totalPages);
      } catch {
        setError("Error fetching contracts");
        toast.error("Error fetching contracts");
      } finally {
        setLoading(false);
      }
    };

    fetchContracts();
  }, [pagination.pageIndex, pagination.pageSize]);

  const deleteContract = async (id: string) => {
    try {
      await axios.delete(`/api/contract?id=${id}`);
      toast.success(`Contract deleted successfully`);
      setData((prevData) => prevData.filter((contract) => contract.id !== id));
    } catch {
      toast.error("Error deleting contract");
    }
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

  if (loading) {
    return <LoadingScreen className="h-full w-full min-h-screen" />;
  }

  if (error) {
    return null;
  }

  return (
    <div className="m-8 p-12">
      <DataTable
        columns={columns}
        data={data}
        CustomFilterComponent={({ globalFilter, setGlobalFilter }) => (
          <SearchInputGlobalFilter
            globalFilter={globalFilter}
            setGlobalFilter={setGlobalFilter}
          >
            <Button
              onClick={() => router.push(`/admin/modify/new`)}
              variant="secondary"
              className="border"
            >
              Add
            </Button>
          </SearchInputGlobalFilter>
        )}
        pagination={pagination}
        onPaginationChange={onPaginationChange}
        totalRows={totalPageCount * pagination.pageSize}
      />
    </div>
  );
}