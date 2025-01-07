import { create } from 'zustand';
import {OpenEOBackend, OpenEOCredentialsProvider} from "../../lib/openeo/models";
import {OpenEOState} from "./types";


export const useOpenEOStore = create<OpenEOState>((set, get) => ({
    backends: [],
    setOpenEOBackends: (backends: OpenEOBackend[]) => set( {backends}),
    credentialProviders: {},
    setCredentialProviders: (backendId: string, providers: OpenEOCredentialsProvider[]) =>
        set( {credentialProviders: {...get().credentialProviders, [backendId]: providers},}),
    selectedBackend: undefined,
    setSelectedBackend: (selectedBackend: OpenEOBackend | undefined) => set({ selectedBackend }),
}));
