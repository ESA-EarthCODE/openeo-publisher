'use client';


import {useToastStore} from "../store/toasts";
import {useQuery} from "@tanstack/react-query";
import {getProjects} from "../lib/earthcode/projects";

export const useEarthCODEProjects = (token?: string) => {
    const {addToast} = useToastStore();

    if (!token) {
        console.warn('No token configured when fetching EarthCODE Projects');
        return {
            data: [],
            loading: false,
        }
    } else {

        const query = useQuery({
            queryKey: ['earthcode-projects'],
            queryFn: async () => {
                try {
                    return await getProjects(token);
                } catch (err: any) {
                    console.error('Could not retrieve EarthCODE Projects', err);
                    addToast({
                        message: 'Could not retrieve EarthCODE Projects',
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