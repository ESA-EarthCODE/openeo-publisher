'use client';


import {useEffect, useState} from "react";
import {OpenEOBackend, OpenEOJob} from "../lib/openeo/models";
import {getOpenEOJobs} from "../lib/openeo/jobs";
import {useToastStore} from "../store/toasts";
import {ResponseError} from "../lib/utils/ResponseError";
import {useRouter} from "next/navigation";
import {useOpenEOStore} from "store/openeo";
import {useQuery, useQueryClient} from "@tanstack/react-query";

export const useOpenEOJobs = (backend: OpenEOBackend | undefined) => {

    const router = useRouter();
    const {addToast} = useToastStore();
    const {setSelectedBackend} = useOpenEOStore();

    const query = useQuery({
        queryKey: ['jobs', backend?.id],
        queryFn: async () => {
            try {
                if (backend) {
                    return (await getOpenEOJobs(backend));
                } else {
                    return [];
                }
            } catch (err: any) {
                if ([401, 403].includes((err as ResponseError).statusCode)) {
                    addToast({
                        message: `You are not authenticated with ${backend?.title}. Please login first`,
                        severity: 'warning',
                    });
                    setSelectedBackend(undefined);
                    router.push('/?step=0');
                } else {
                    console.error('Could not retrieve openEO jobs', err);
                    addToast({
                        message: err.message,
                        severity: 'error',
                    });
                }
                throw err;
            }
        },
        enabled: !!backend,
        staleTime: 10 * 1000, // Cache for 10 seconds
    })

    return {
        data: query.data || [],
        error: query.error,
        loading: query.isLoading,
    };
}