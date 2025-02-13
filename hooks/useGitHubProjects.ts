'use client';


import {useToastStore} from "../store/toasts";
import {useQuery} from "@tanstack/react-query";
import {getProjects} from "../lib/github/projects";

export const useGitHubProjects = (token?: string) => {
    const {addToast} = useToastStore();

    if (!token) {
        console.warn('No token configured when fetching GitHub Projects');
        return {
            data: [],
            loading: false,
        }
    } else {

        const query = useQuery({
            queryKey: ['github-projects'],
            queryFn: async () => {
                try {
                    return await getProjects(token);
                } catch (err: any) {
                    console.error('Could not retrieve GitHub projects', err);
                    addToast({
                        message: 'Could not retrieve GitHub Projects',
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