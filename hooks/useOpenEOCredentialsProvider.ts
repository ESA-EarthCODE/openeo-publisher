'use client';


import {useEffect, useState} from "react";
import {OpenEOBackend, OpenEOCredentialsProvider} from "../lib/openeo/models";
import {useToastStore} from "../store/toasts";
import {getCredentialProviders} from "../lib/openeo/backends";
import {ResponseError} from "../lib/utils/ResponseError";
import {useOpenEOStore} from "../store/openeo";

export const useOpenEOCredentialsProvider = (backend: OpenEOBackend | undefined) => {
    const [data, setData] = useState<OpenEOCredentialsProvider[]>([]);
    const [error, setError] = useState<ResponseError | null>(null);
    const [loading, setLoading] = useState(true);
    const {addToast} = useToastStore();
    const {setCredentialProviders} = useOpenEOStore();

    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            try {
                if (backend) {
                    const result = await getCredentialProviders(backend.url);
                    setCredentialProviders(backend.id, result);
                    setData(result);
                } else {
                    setData([]);
                }
            } catch (err: any) {
                console.error('Could not retrieve openEO credential providers', err);
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