'use client'
import React, { useState, useEffect } from "react";
import { MultiSelect } from "@/components/ui/multiSelect";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ContractStatus } from "@prisma/client";
import { toast } from "react-toastify";
import axios from "axios";
import { useUserStatuses } from "@/hooks/use-user-statuses";
import { useSession } from "next-auth/react";

const statusesOptions = [
    { label: "Draft", value: "DRAFT" },
    { label: "Finalized", value: "FINALIZED" },
    { label: "In Review", value: "IN_REVIEW" },
    { label: "Canceled", value: "CANCELED" },
];

const UserStatusesForm: React.FC = () => {
    const { statuses, loading, refetch } = useUserStatuses();
    const [selectedStatuses, setSelectedStatuses] = useState<ContractStatus[]>([]);
    const [submitting, setSubmitting] = useState(false);
    const id = useSession().data?.user.id;

    useEffect(() => {
        if (statuses.length > 0) {
            setSelectedStatuses(statuses);
        }
    }, [statuses]);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setSubmitting(true);
        const updateUserStatuses = async (statuses: ContractStatus[]): Promise<void> => {
            try {
                const response = await axios.post(`/api/user/status`, { id, statuses });
                if (response.status !== 200) {
                    throw new Error("Failed to update user statuses");
                }
                return response.data;
            } catch (error) {
                console.error(error);
                toast.error("Failed to update user statuses");
                throw error;
            }
        };

        try {
            await updateUserStatuses(selectedStatuses);
            toast.success("User statuses updated successfully");
            await refetch();
        } catch (error) {
            console.error(error);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Card className="m-4 p-4">
            <CardHeader>
                <CardTitle>Select Contract Statuses to be notified upon</CardTitle>
            </CardHeader>
            <CardContent>
                {loading ? (
                    <p>Loading...</p>
                ) : (
                    <form onSubmit={handleSubmit}>
                        <MultiSelect
                            options={statusesOptions}
                            onValueChange={(value: string[]) => setSelectedStatuses(value as ContractStatus[])}
                            defaultValue={selectedStatuses}
                            placeholder="Select statuses"
                            maxCount={10}
                        />
                        <Button type="submit" className="mt-4" disabled={submitting}>
                            {submitting ? "Saving..." : "Save Changes"}
                        </Button>
                    </form>
                )}
            </CardContent>
        </Card>
    );
};

export default UserStatusesForm;
