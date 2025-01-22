'use client';


import {useEffect, useState} from "react";
import {OpenEOBackend} from "../lib/openeo/models";
import {getOpenEOBackends} from "../lib/openeo/backends";
import {useToastStore} from "../store/toasts";
import {useOpenEOStore} from "../store/openeo";
import {ResponseError} from "../lib/utils/ResponseError";
import { useQuery } from "@tanstack/react-query";

export const useOpenEOBackends = () => {
    const { addToast } = useToastStore();
    const { setOpenEOBackends } = useOpenEOStore();

    const query = useQuery({
        queryKey: ['backends'],
        queryFn: async () => {
            try {
                const result = await getOpenEOBackends();
                setOpenEOBackends(result);
                return result;
            } catch (err: any) {
                console.error('Could not retrieve openEO backends', err);
                addToast({
                    message: err.message,
                    severity: 'error',
                });
                throw err;
            }
        }
    });

    return {
        data: query.data || [],
        error: query.error,
        loading: query.isLoading,
    };
}