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
import { UserDataTableRow } from "@/types/user";
import { usePagination } from "@/hooks/use-pagination";

export default function Users() {
  const [data, setData] = useState<UserDataTableRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { pagination, onPaginationChange } = usePagination();
  const [totalPageCount, setTotalPageCount] = useState<number>(0);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("/api/user", {
          params: {
            pageIndex: pagination.pageIndex,
            pageSize: pagination.pageSize,
          },
        });
        setData(response.data.data.users);
        setTotalPageCount(response.data.data.totalPages);
      } catch {
        setError("Error fetching users");
        toast.error("Error fetching users");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [pagination.pageIndex, pagination.pageSize]);

  const deleteUser = async (id: string) => {
    try {
      await axios.delete(`/api/user?id=${id}`);
      toast.success(`User deleted successfully`);
      setData((prevData) => prevData.filter((user) => user.id !== id));
    } catch {
      toast.error("Error deleting user");
    }
  };

  const columns: ColumnDef<UserDataTableRow>[] = [
    {
      id: "index",
      header: "No.",
      cell: (info) => info.row.index + 1,
    },
    {
      accessorKey: "name",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Name" />
      ),
    },
    {
      accessorKey: "email",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Email" />
      ),
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const user = row.original;
        const actions = [
          {
            name: "Delete",
            onClick: () => deleteUser(user.id),
            requiresConfirmation: true,
          },
          {
            name: "Edit",
            onClick: () => router.push(`/admin/modify/user/${user.id}`),
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
              onClick={() => router.push(`/admin/modify/user/new`)}
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
