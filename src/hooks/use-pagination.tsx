import { useState } from "react";
import { OnChangeFn, PaginationState } from "@tanstack/react-table"

export function usePagination(): { onPaginationChange: OnChangeFn<PaginationState>, pagination: PaginationState } {
    const [pagination, setPagination] = useState<PaginationState>({
        pageSize: 5,
        pageIndex: 0
    });
    return ({
        pagination, onPaginationChange: setPagination
    })
}