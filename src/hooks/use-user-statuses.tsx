import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { ContractStatus } from "@prisma/client";
import { toast } from "react-toastify";
import { useSession } from "next-auth/react";

export function useUserStatuses() {
    const [statuses, setStatuses] = useState<ContractStatus[]>([]);
    console.log("statuses",statuses)
    const [loading, setLoading] = useState(true);
    const { data: session } = useSession();
    const id = session?.user?.id;

    const fetchUserStatuses = useCallback(async () => {
        if (!id) {
            console.log("User ID not available yet");
            return;
        }
        try {
            console.log("id", id);
            const response = await axios.get('/api/user/status', { params: { id } });
            if (response.status !== 200) {
                throw new Error("Failed to fetch user statuses");
            }
            console.log(response);
            setStatuses(response.data.data);
        } catch (error) {
            toast.error("Failed to fetch user statuses");
            console.error(error);
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        if (id) {
            fetchUserStatuses();
        }
    }, [id, fetchUserStatuses]);

    return { statuses, loading, refetch: fetchUserStatuses };
}
