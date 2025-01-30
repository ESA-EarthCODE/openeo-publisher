'use client';

import {create} from 'zustand';
import {OpenEOBackend, OpenEOCredentialsProvider, OpenEOJob} from "../../lib/openeo/jobs.models";
import {OpenEOState} from "./types";


export const useOpenEOStore = create<OpenEOState>((set, get) => ({
    backends: [],
    setOpenEOBackends: (backends: OpenEOBackend[]) => set({backends}),
    credentialProviders: {},
    setCredentialProviders: (backendId: string, providers: OpenEOCredentialsProvider[]) =>
        set({credentialProviders: {...get().credentialProviders, [backendId]: providers},}),
    selectedBackend: undefined,
    setSelectedBackend: (selectedBackend: OpenEOBackend | undefined) => {
        if (typeof window !== 'undefined') {
            if (selectedBackend) {
                window?.localStorage.setItem('openeo_backend', JSON.stringify(selectedBackend));
            } else {
                window?.localStorage.removeItem('openeo_backend');
            }
        }
        set({selectedBackend})
    },
    selectedJobs: [],
    setSelectedJobs: (selectedJobs: OpenEOJob[]) => set({selectedJobs}),
}));
