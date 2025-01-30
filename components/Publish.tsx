import {Alert, Button, CircularProgress, LinearProgress} from "@mui/material";
import {OpenEOBackend, OpenEOJob} from "../lib/openeo/jobs.models";
import React, {useState} from "react";
import {createBranch} from "../lib/github/branches";
import moment from "moment/moment";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AccessTimeFilledIcon from '@mui/icons-material/AccessTimeFilled';
import {getOpenEOJobDetails} from "../lib/openeo/jobs";
import {createFile} from "../lib/github/files";
import {createPR} from "../lib/github/pr";

interface PublishProps {
    jobs: OpenEOJob[];
    backend: OpenEOBackend;
}


export const Publish = ({backend, jobs}: PublishProps) => {

    const [status, setStatus] = useState<string>();
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>();
    const [done, setDone] = useState<boolean>(false);
    const [progress, setProgress] = useState<number>(0);
    const [jobsProcessing, setJobsProcessing] = useState<OpenEOJob[]>([]);
    const [jobsDone, setJobsDone] = useState<OpenEOJob[]>([]);

    const steps = jobs.length + 2;
    let stepCount = 1;

    const updateProgress = () => setProgress(Math.round(((stepCount++) / steps) * 100))

    const setJobProcessing = (job: OpenEOJob) => {
        setJobsProcessing((jobs) => [...jobs, job]);
        setJobsDone((jobs) => jobs.filter((j) => j.id !== job.id));
    }
    const setJobDone = (job: OpenEOJob) => {
        setJobsDone((jobs) => [...jobs, job]);
        setJobsProcessing((jobs) => jobs.filter((j) => j.id !== job.id));
    }

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
                setJobProcessing(job);

                const details = await getOpenEOJobDetails(backend, job.id);
                await createFile(branch, `experiments/openeo/${job.id}.json`, details);

                updateProgress();
                setJobDone(job);
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

    const generateJobIcon = (job: OpenEOJob) => {
        if (jobsProcessing.includes(job)) {
            return <CircularProgress size={21}/>
        } else if (jobsDone.includes(job)) {
            return <CheckCircleIcon color='success'/>
        } else {
            return <AccessTimeFilledIcon color='disabled' />
        }
    }

    return <div
        className='flex flex-col'>
        <div>
            <div className='font-bold'>Summary</div>
            <div className='flex flex-col gap-2 my-5'>
                {
                    jobs.map((job, idx) => <div key={idx} className='flex items-center gap-2' data-testid='job-summary'>
                        <div>
                            {
                                generateJobIcon(job)
                            }
                        </div>
                        {job.title}
                    </div>)
                }
            </div>
            <Button onClick={publishJobs} color='primary' variant='contained' data-testid='publish-button'>Publish</Button>
        </div>
        <div className='flex flex-col flex-1 items-center justify-center mt-5'>
            <LinearProgress color={error ? 'error': (done ? 'success' : 'info')} variant="determinate" value={progress} className='w-full min-h-2 rounded-full'></LinearProgress>
            <div className='mt-2 w-full'>
                {error && <Alert
                    severity='error'
                    variant="standard"
                >
                    {error}
                </Alert>
                }
                {status && <Alert
                    severity={done ? 'success' : 'info'}
                    variant="standard"
                >
                    {status}
                </Alert>}
            </div>
        </div>
    </div>
}