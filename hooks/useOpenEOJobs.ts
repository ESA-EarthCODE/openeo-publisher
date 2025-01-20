'use client';


import {useEffect, useState} from "react";
import {OpenEOBackend, OpenEOJob} from "../lib/openeo/models";
import {getOpenEOJobs} from "../lib/openeo/jobs";
import {useToastStore} from "../store/toasts";
import {ResponseError} from "../lib/utils/ResponseError";
import {useRouter} from "next/navigation";
import { useOpenEOStore } from "store/openeo";

export const useOpenEOJobs = (backend: OpenEOBackend | undefined) => {

    const router = useRouter();
    const [data, setData] = useState<OpenEOJob[]>([]);
    const [error, setError] = useState<ResponseError | null>(null);
    const [loading, setLoading] = useState(true);
    const { addToast } = useToastStore();
    const { setSelectedBackend } = useOpenEOStore();

    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            try {
                if (backend) {
                    const result = await getOpenEOJobs(backend);
                    setData(result);
                } else {
                    setData([]);
                }
            } catch (err: any) {
                if ((err as ResponseError).statusCode === 401) {
                    addToast({
                        message: `You are not authenticated with ${backend?.title}. Please login first`,
                        severity: 'warning',
                    });
                } else {
                    console.error('Could not retrieve openEO jobs', err);
                    addToast({
                        message: err.message,
                        severity: 'error',
                    });
                }
                setSelectedBackend(undefined);
                router.push('/?step=0');
                setError(err);
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, [backend]);

    return {data, error, loading};
}