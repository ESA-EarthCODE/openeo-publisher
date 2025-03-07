'use client';


import {useToastStore} from "../store/toasts";
import {useQuery} from "@tanstack/react-query";
import {getWorkflows} from "../lib/earthcode/workflows";

export const useEarthCODEWorkflows = (token?: string) => {
    const {addToast} = useToastStore();

    if (!token) {
        console.warn('No token configured when fetching EarthCODE Workflows');
        return {
            data: [],
            loading: false,
        }
    } else {

        const query = useQuery({
            queryKey: ['earthcode-workflows'],
            queryFn: async () => {
                try {
                    return await getWorkflows(token);
                } catch (err: any) {
                    console.error('Could not retrieve EarthCODE Workflows', err);
                    addToast({
                        message: 'Could not retrieve EarthCODE Workflows',
                        severity: 'warning',
                    });
                    return [];
                }
            }
        });

        return {
            data: query.data || [],
            error: query.error,
            loading: query.isLoading,
        };
    }
}