'use client';


import {useToastStore} from "../store/toasts";
import {useQuery} from "@tanstack/react-query";
import {getThemes} from "../lib/earthcode/themes";

export const useEarthCODEThemes = (token?: string) => {
    const {addToast} = useToastStore();

    if (!token) {
        console.warn('No token configured when fetching EarthCODE Themes');
        return {
            data: [],
            loading: false,
        }
    } else {

        const query = useQuery({
            queryKey: ['earthcode-themes'],
            queryFn: async () => {
                try {
                    return await getThemes(token);
                } catch (err: any) {
                    console.error('Could not retrieve EarthCODE Themes', err);
                    addToast({
                        message: 'Could not retrieve EarthCODE Themes',
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