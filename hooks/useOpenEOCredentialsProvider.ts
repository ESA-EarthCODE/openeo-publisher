'use client';


import {useEffect, useState} from "react";
import {OpenEOBackend, OpenEOCredentialsProvider} from "../lib/openeo/jobs.models";
import {useToastStore} from "../store/toasts";
import {getCredentialProviders} from "../lib/openeo/backends";
import {ResponseError} from "../lib/utils/ResponseError";
import {useOpenEOStore} from "../store/openeo";
import {useQuery} from "@tanstack/react-query";

export const useOpenEOCredentialsProvider = (backend: OpenEOBackend | undefined) => {
    const {addToast} = useToastStore();
    const {setCredentialProviders} = useOpenEOStore();


    const query = useQuery({
        queryKey: ['credential-providers', backend?.id],
        queryFn: async () => {
            try {
                if (backend) {
                    const result = await getCredentialProviders(backend.url);
                    setCredentialProviders(backend.id, result);
                    return result;
                } else {
                    return [];
                }
            } catch (err: any) {
                console.error('Could not retrieve openEO credential providers', err);
                addToast({
                    message: err.message,
                    severity: 'error',
                });
                throw err;
            }
        },
        enabled: !!backend,
        staleTime: 15 * 60 * 1000
    });

    return {
        data: query.data || [],
        error: query.error,
        loading: query.isLoading,
    };
}