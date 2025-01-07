export type Toast = {
    id: string;
    message: string;
    severity: 'success' | 'info' | 'warning' | 'error'; // Toast types
};

export type ToastStore = {
    toasts: Toast[];
    addToast: (toast: Omit<Toast, 'id'>) => void;
    removeToast: (id: string) => void;
};
