"use client";

import {useState} from 'react';
import {useToastStore} from "../store/toasts";
import {Button, CircularProgress, Typography} from "@mui/material";
import GitHubIcon from '@mui/icons-material/GitHub';
import {signInGitHub} from "../lib/auth";


export const SignInForm = () => {

    const {addToast} = useToastStore();
    const [loading, setLoading] = useState<boolean>(false);

    const authenticateGitHub = async () => {  // Add `async` to properly handle `await`
        setLoading(true);
        try {
            await signInGitHub();  // Await signIn
        } catch (error) {
            console.error('Something went wrong while authenticating with GitHub', error);
            addToast({
                message: error instanceof Error ? error.message : 'Unknown error',
                severity: 'error',
            });
            setLoading(false);
        }
    };


    return (
        <div className='flex flex-col'>
            <Typography variant='h6'>Welcome to the EarthCODE openEO Publisher</Typography>
            <span className='text-sm'>Please login with your EarthCODE account to start publishing your openEO workflows and results to the EarthCODE Open Science Catalogue</span>
            <div className='mt-10 w-full' >
                <Button
                    variant="contained"
                    className='w-full'
                    onClick={authenticateGitHub}
                    endIcon={!loading ? <GitHubIcon /> : <CircularProgress size={20} />}
                    disabled={loading} // Disable button when loading
                    data-testid="login-button"
                >
                    {loading ? "Signing in..." : "Log in"}
                </Button>
            </div>
        </div>
    );
}