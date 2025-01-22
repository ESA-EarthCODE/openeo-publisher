'use client';

import React from 'react';
import {Alert} from '@mui/material';
import {useToastStore} from "../store/toasts";
import {Toast} from "../store/toasts/types";

export const Toasts = () => {
    const {toasts, removeToast} = useToastStore();

    return (
        <div className='absolute bottom-10 left-1/2 transform -translate-x-1/2  w-1/3 flex  flex-col items-center justify-center'>
            {toasts.map((toast: Toast) => (
                <div className='shadow-lg mt-2 w-full'  key={`toast-${toast.id}`}>
                    <Alert
                        onClose={() => removeToast(toast.id)}
                        severity={toast.severity}
                        variant="standard"
                        data-testid='toast'
                    >
                        {toast.message}
                    </Alert>
                </div>
            ))}
        </div>
    );
};
