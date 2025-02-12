import {
    Alert,
    Button,
    CircularProgress,
    FormControl,
    InputLabel,
    LinearProgress,
    MenuItem,
    Select
} from "@mui/material";
import {JobSchemaInfo, OpenEOBackend, OpenEOJob} from "../lib/openeo/jobs.models";
import React, {useState} from "react";
import {createBranch} from "../lib/github/branches";
import moment from "moment/moment";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AccessTimeFilledIcon from '@mui/icons-material/AccessTimeFilled';
import {getOpenEOJobDetails} from "../lib/openeo/jobs";
import {createFile} from "../lib/github/files";
import {createPR} from "../lib/github/pr";
import {useSession} from "next-auth/react";
import {useToastStore} from "../store/toasts";
import {SchemaType} from "../lib/earthcode/schema.model";

interface PublishProps {
    jobs: OpenEOJob[];
    backend: OpenEOBackend;
}


export const Publish = ({backend, jobs}: PublishProps) => {

    const [status, setStatus] = useState<string>();
    const [error, setError] = useState<string>();
    const [done, setDone] = useState<boolean>(false);
    const [progress, setProgress] = useState<number>(0);
    const [jobsProcessing, setJobsProcessing] = useState<OpenEOJob[]>([]);
    const [jobsDone, setJobsDone] = useState<OpenEOJob[]>([]);
    const [jobSchemas, setJobSchemas] = useState<JobSchemaInfo[]>([]);
    const {data: session} = useSession();
    const {addToast} = useToastStore();

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
        const token = session?.accessToken;

        if (token) {
            try {
                setError('');
                setProgress(1)
                setDone(false);

                const branch = `openeo-publish-${moment().format('YYYY-MM-DD-HH-mm-ss-SSS')}`

                setStatus('Creating branch');
                await createBranch(token, branch);
                updateProgress();

                let jobIdx = 1;
                for (const job of jobs) {
                    setStatus(`Fetching job information from ${job.title} (${jobIdx}/${jobs.length})`);
                    setJobProcessing(job);

                    const details = await getOpenEOJobDetails(backend, job.id);
                    await createFile(token, branch, `experiments/openeo/${job.id}.json`, details);

                    updateProgress();
                    setJobDone(job);
                    jobIdx++;
                }

                setStatus('Creating PR')
                await createPR(token, branch, backend, jobs);

                setStatus('Publishing complete');
                setProgress(100);
                setDone(true);
            } catch (e: any) {
                setError(e.message);
            }
        } else {
            addToast({
                message: 'You are not authenticated with GitHub. Please refresh the page.',
                severity: 'error'
            });
        }
    }

    const generateJobIcon = (job: OpenEOJob) => {
        if (jobsProcessing.includes(job)) {
            return <CircularProgress size={21}/>
        } else if (jobsDone.includes(job)) {
            return <CheckCircleIcon color='success'/>
        } else {
            return <AccessTimeFilledIcon color='disabled'/>
        }
    }

    const handleJobSchemaChange = (job: OpenEOJob, value: any) => {
        const types: SchemaType[] = typeof value === 'string' ? value.split(',') : value;
        let newJobSchemas = jobSchemas.filter((s: JobSchemaInfo) => s.job === job);

        for (const type of types) {
            // Add new types
            if (!newJobSchemas.find((s: JobSchemaInfo) => s.type === type)) {
                newJobSchemas.push({type, job, id: job.id, project: ''});
            }
        }
        // Remove the ones that aren't in the list
        newJobSchemas = newJobSchemas.filter((s: JobSchemaInfo) => types.includes(s.type));
        setJobSchemas([...jobSchemas.filter((s: JobSchemaInfo) => s.job !== job), ...newJobSchemas]);
    }

    const getJobValues = (job: OpenEOJob): SchemaType[] => {
        return jobSchemas.filter((schema: JobSchemaInfo) => schema.job === job).map((schema: JobSchemaInfo) => schema.type);
    }

    return <div
        className='flex flex-col'>
        <div>
            <div className='font-bold'>Summary</div>
            <div className='flex flex-col gap-2 my-5'>
                {
                    jobs.map((job, idx) => <div key={idx}
                                                className='flex items-center gap-2 border-2 border-neutral-100 rounded-lg py-2 px-4 justify-between'
                                                data-testid='job-summary'>
                        <div>
                            <span>{job.title}</span>
                        </div>
                        <div>
                            <FormControl>
                                <InputLabel id={`select-as-${idx}-label`}>Publish as</InputLabel>
                                <Select
                                    labelId={`select-as-${idx}-label`}
                                    label="Publish as"
                                    multiple
                                    value={getJobValues(job)}
                                    onChange={(event) => handleJobSchemaChange(job, event.target.value as SchemaType)}
                                    className='min-w-64'
                                >
                                    {Object.values(SchemaType).map((type: string) => (
                                        <MenuItem
                                            key={`schema_type_${type}`}
                                            value={type}
                                        >
                                            {type}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </div>
                    </div>)
                }
            </div>
            <Button onClick={publishJobs} color='primary' variant='contained' disabled={jobSchemas.length == 0}
                    data-testid='publish-button'>Publish</Button>
        </div>
        <div className='flex flex-col flex-1 items-center justify-center mt-5'>
            <LinearProgress color={error ? 'error' : (done ? 'success' : 'info')} variant="determinate" value={progress}
                            className='w-full min-h-2 rounded-full'></LinearProgress>
            <div className='mt-2 w-full'>
                {error && <Alert
                    severity='error'
                    variant="standard"
                >
                    {error}
                </Alert>
                }
                {status && !error && <Alert
                    severity={done ? 'success' : 'info'}
                    variant="standard"
                >
                    {status}
                </Alert>}
            </div>
        </div>
    </div>
}