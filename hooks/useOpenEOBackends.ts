'use client';


import {useEffect, useState} from "react";
import {OpenEOBackend} from "../lib/openeo/models";
import {getOpenEOBackends} from "../lib/openeo/backends";
import {useToastStore} from "../store/toasts";
import {useOpenEOStore} from "../store/openeo";
import {ResponseError} from "../lib/utils/ResponseError";

export const useOpenEOBackends = () => {
    const [data, setData] = useState<OpenEOBackend[]>([]);
    const [error, setError] = useState<ResponseError | null>(null);
    const [loading, setLoading] = useState(true);
    const { addToast } = useToastStore();
    const { setOpenEOBackends } = useOpenEOStore();

    useEffect(() => {
        async function fetchData() {
            try {
                const result = await getOpenEOBackends();
                setOpenEOBackends(result);
                setData(result);
            } catch (err: any) {
                console.error('Could not retrieve openEO backends', err);
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
    }, []);

    return {data, error, loading};
}