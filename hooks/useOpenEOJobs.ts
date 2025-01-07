'use client';


import {useEffect, useState} from "react";
import {OpenEOBackend, OpenEOJob} from "../lib/openeo/models";
import {getOpenEOJobs} from "../lib/openeo/jobs";
import {useToastStore} from "../store/toasts";

export const useOpenEOJobs = (backend: OpenEOBackend | undefined) => {
    const [data, setData] = useState<OpenEOJob[]>([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const { addToast } = useToastStore();

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
                console.error('Could not retrieve openEO jobs', err);
                addToast({
                    message: err.message,
                    severity: 'error',
                });
                setError(err);
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, [backend]);

    return {data, error, loading};
}