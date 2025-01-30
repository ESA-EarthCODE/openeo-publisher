'use client';


import {OpenEOBackend} from "../lib/openeo/jobs.models";
import {getOpenEOJobs} from "../lib/openeo/jobs";
import {useToastStore} from "../store/toasts";
import {ResponseError} from "../lib/utils/ResponseError";
import {useOpenEOStore} from "store/openeo";
import {useQuery} from "@tanstack/react-query";
import {useWizardStore} from "../store/wizard";

export const useOpenEOJobs = (backend: OpenEOBackend | undefined) => {

    const {addToast} = useToastStore();
    const {setSelectedBackend} = useOpenEOStore();
    const {setActiveStep} = useWizardStore();

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
                } else {
                    console.error('Could not retrieve openEO jobs', err);
                    addToast({
                        message: err.message,
                        severity: 'error',
                    });
                }
                setActiveStep(0);
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