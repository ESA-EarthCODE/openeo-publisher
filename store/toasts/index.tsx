import { create } from 'zustand';
import {ToastStore} from "./types";


export const useToastStore = create<ToastStore>((set) => ({
    toasts: [],
    addToast: (toast) => {
        const id = `${Date.now()}-${Math.random()}`;
        set((state) => ({ toasts: [...state.toasts, { ...toast, id }] }));

        // Automatically remove the toast after 5 seconds
        setTimeout(() => {
            set((state) => ({
                toasts: state.toasts.filter((t) => t.id !== id),
            }));
        }, 5000);
    },
    removeToast: (id) =>
        set((state) => ({
            toasts: state.toasts.filter((t) => t.id !== id),
        })),
}));
