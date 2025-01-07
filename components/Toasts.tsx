'use client';

import React from 'react';
import {Alert, Snackbar} from '@mui/material';
import {useToastStore} from "../store/toasts";
import {Toast} from "../store/toasts/types";

export const Toasts = () => {
    const {toasts, removeToast} = useToastStore();

    return (
        <>
            {toasts.map((toast: Toast) => (
                <Snackbar
                    key={toast.id}
                    open={true}
                    autoHideDuration={5000}
                    anchorOrigin={{vertical: 'bottom', horizontal: 'center'}}
                >
                    <Alert
                        onClose={() => removeToast(toast.id)}
                        severity={toast.severity}
                        variant="standard"
                    >
                        {toast.message}
                    </Alert>
                </Snackbar>
            ))}
        </>
    );
};
