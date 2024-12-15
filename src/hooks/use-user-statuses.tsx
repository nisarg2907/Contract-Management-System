import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { ContractStatus } from "@prisma/client";
import { toast } from "react-toastify";
import { useSession } from "next-auth/react";

export function useUserStatuses() {
    const [statuses, setStatuses] = useState<ContractStatus[]>([]);
    const [loading, setLoading] = useState(true);
    const { data: session } = useSession();
    const id = session?.user?.id;

    const fetchUserStatuses = useCallback(async () => {
        if (!id) {
            return;
        }
        try {
          
            const response = await axios.get('/api/user/status', { params: { id } });
            if (response.status !== 200) {
                throw new Error("Failed to fetch user statuses");
            }
            setStatuses(response.data.data);
        } catch  {
            toast.error("Failed to fetch user statuses");
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
