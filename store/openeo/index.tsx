import { create } from 'zustand';
import {OpenEOBackend} from "../../lib/openeo/models";
import {OpenEOState} from "./types";


export const useOpenEOStore = create<OpenEOState>((set) => ({
    selectedBackend: undefined,
    setSelectedBackend: (selectedBackend: OpenEOBackend | undefined) => set({ selectedBackend }),
}));
