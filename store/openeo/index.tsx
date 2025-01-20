import { create } from 'zustand';
import {OpenEOBackend, OpenEOCredentialsProvider, OpenEOJob} from "../../lib/openeo/models";
import {OpenEOState} from "./types";


export const useOpenEOStore = create<OpenEOState>((set, get) => ({
    backends: [],
    setOpenEOBackends: (backends: OpenEOBackend[]) => set( {backends}),
    credentialProviders: {},
    setCredentialProviders: (backendId: string, providers: OpenEOCredentialsProvider[]) =>
        set( {credentialProviders: {...get().credentialProviders, [backendId]: providers},}),
    selectedBackend: localStorage.getItem('openeo_backend') ? JSON.parse(localStorage.getItem('openeo_backend') || '') : undefined,
    setSelectedBackend: (selectedBackend: OpenEOBackend | undefined) => {
        localStorage.setItem('openeo_backend', JSON.stringify(selectedBackend));
        set({ selectedBackend })
    },
    selectedJobs: [],
    setSelectedJobs: (selectedJobs: OpenEOJob[]) => set({ selectedJobs }),
}));
