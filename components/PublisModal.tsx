import {Alert, CircularProgress, Modal, Typography} from "@mui/material";
import {OpenEOBackend, OpenEOJob} from "../lib/openeo/models";
import React, {useEffect, useState} from "react";
import {createBranch} from "../lib/github/branches";
import moment from "moment/moment";
import ErrorIcon from '@mui/icons-material/Error';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import {getOpenEOJobDetails} from "../lib/openeo/jobs";
import {createFile} from "../lib/github/files";
import {createPR} from "../lib/github/pr";

interface PublishModalProps {
    jobs: OpenEOJob[];
    backend: OpenEOBackend;
    open: boolean;
    handleClose: () => void;
}


export const PublishModal = ({open, handleClose, backend, jobs}: PublishModalProps) => {

    const [status, setStatus] = useState<string>();
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>();
    const [done, setDone] = useState<boolean>(false);
    const [progress, setProgress] = useState<number>(0);

    const steps = jobs.length + 2;
    let stepCount = 1;

    const updateProgress = () => setProgress(Math.round(((stepCount++) / steps) * 100))

    useEffect(() => {
        const publishJobs = async () => {
            try {
                setError('');
                setProgress(1)
                setLoading(true);
                setDone(false);

                const branch = `openeo-publish-${moment().format('YYYY-MM-DD-HH-mm-ss-SSS')}`

                setStatus('Creating branch');
                await createBranch(branch);
                updateProgress();

                let jobIdx = 1;
                for (const job of jobs) {
                    setStatus(`Fetching job information from ${job.title} (${jobIdx}/${jobs.length})`);

                    const details = await getOpenEOJobDetails(backend, job.id);
                    await createFile(branch, `experiments/openeo/${job.id}.json`, details);

                    updateProgress();
                    jobIdx++;
                }

                setStatus('Creating PR')
                await createPR(branch, backend, jobs);

                setStatus('Publishing complete');
                setProgress(100);
                setDone(true);
                setLoading(false);
            } catch (e: any) {
                setError(e.message);
                setLoading(false);
            }
        }
        if (open && jobs.length > 0) {
            publishJobs();
        }
    }, [open, jobs]);

    return <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="EarthCODE Publish Wizard"
    >
        <div
            className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg p-5 w-96 flex flex-col'>
            <div className='text-center mb-10'>
                <Typography variant={'h6'}>Publishing to EarthCODE</Typography>
            </div>
            <div className='flex flex-col flex-1 items-center justify-center'>
                {loading && <CircularProgress color='primary' size={85} variant="determinate" value={progress}></CircularProgress>}
                {error && <ErrorIcon sx={{height: 100, width: 100}} color='error'/>}
                {done && <CheckCircleIcon sx={{height: 100, width: 100}} color='success'/>}
                <div className='mt-10 w-full'>
                    {error ? <Alert
                        severity='error'
                        variant="standard"
                    >
                        {error}
                    </Alert> :  <Alert
                        severity={done ? 'success' : 'info'}
                        variant="standard"
                    >
                        {status}
                    </Alert>}
                </div>
            </div>
        </div>
    </Modal>
}