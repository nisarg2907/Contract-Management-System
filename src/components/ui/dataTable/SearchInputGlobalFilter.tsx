import React from "react";
import { Input } from "@/components/ui/input";
import { CustomFilterComponentProps } from "@/components/ui/dataTable/dataTable";

export const SearchInputGlobalFilter: React.FC<CustomFilterComponentProps & { children: React.ReactNode; isGlobalFilter?: boolean }> = ({
    globalFilter,
    setGlobalFilter,
    children,
    isGlobalFilter = true
    // customComponent = null, 
    // onAdd = undefined, 
}) => {
    return (
        <div className="flex md:flex-row max-md:flex-col items-center gap-4 w-full">
            {/* Global text filter */}
            <div className={`flex flex-row items-center w-full gap-4 ${!isGlobalFilter ? "hidden" : ""}`}>
                <Input
                    placeholder="Search..."
                    value={globalFilter}
                    onChange={(e) => setGlobalFilter(e.target.value)}
                />
            </div>

            {/* Optional custom component (e.g., dropdown or filters) */}
            {/* {customComponent && (
                <div className="flex flex-row items-center w-full gap-4">
                    {customComponent}
                </div>
            )} */}

            {/* Add Button Logic */}
            {/* {onAdd && (
                <Button
                    onClick={onAdd}
                    variant={"secondary"}
                    className="border"
                    size={"default"}
                >
                    Add
                </Button>
            )} */}
            {children}
        </div>
    );
};