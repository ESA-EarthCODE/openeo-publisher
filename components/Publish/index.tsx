import {Alert, Button, CircularProgress, LinearProgress} from "@mui/material";
import {OpenEOBackend, OpenEOJob} from "../../lib/openeo/jobs.models";
import React, {useCallback, useState, useTransition} from "react";
import moment from "moment";
import {useSession} from "next-auth/react";
import {useToastStore} from "../../store/toasts";
import {ExperimentInfo, JobSchemaInfo, ProductInfo, SchemaType, WorkflowInfo} from "../../lib/earthcode/schema.model";
import {JobSummary} from "@/components/Publish/JobSummary";
import {JobSchemaForm} from "@/components/Publish/JobSchemaForm";
import {Loading} from "@/components/Loading";
import {useEarthCODEProjects} from "../../hooks/useEarthCODEProjects";
import {publishSchemas} from "../../lib/earthcode/publish";
import {useWizardStore} from "../../store/wizard";
import {useEarthCODEThemes} from "../../hooks/useEarthCODEThemes";

interface PublishProps {
    jobs: OpenEOJob[];
    backend: OpenEOBackend;
}


export const Publish = ({backend, jobs}: PublishProps) => {
    const [status, setStatus] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [done, setDone] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [progress, setProgress] = useState<number>(0);
    const [jobSchemas, setJobSchemas] = useState<JobSchemaInfo[]>([]);
    const {data: session} = useSession();
    const {data: projects, loading: projectsLoading} = useEarthCODEProjects(session?.accessToken);
    const {data: themes, loading: themesLoading} = useEarthCODEThemes(session?.accessToken);
    const [_, startTransition] = useTransition();
    const {addToast} = useToastStore();
    const { setActiveStep } = useWizardStore();

    const publishJobs = async () => {
        const token = session?.accessToken;

        if (!token) {
            addToast({
                message: "You are not authenticated with GitHub. Please refresh the page.",
                severity: "error"
            });
            return;
        }

        setError(null);
        setStatus(null);
        setDone(false);
        setLoading(true);

        startTransition(async () => {
            const branch = `openeo-publish-${moment().format("YYYY-MM-DD-HH-mm-ss-SSS")}`;
            for await (const {status, message, progress} of publishSchemas(token, branch, backend, jobSchemas)) {
                setProgress(progress);
                if (status === 'error') {
                    setError(() => message);
                    setLoading(false);
                    if (message.includes('403')) {
                        setActiveStep(0);
                    }
                } else {
                    setStatus(message);
                }
                if (status === 'complete') {
                    setDone(true);
                    setLoading(false);
                }
            }
        });
    };

    const initProductSchemaType = (job: OpenEOJob): ProductInfo => {
        return {
            type: SchemaType.PRODUCT,
            job,
            id: job.title.toLowerCase().replaceAll(' ', '_'),
            title: `${job.title} - Product`,
            description: job.description || `Product of ${job.title}`,
            themes: [],
        } as ProductInfo;
    }

    const initWorkflowSchemaType = (job: OpenEOJob): WorkflowInfo => {
        return {
            type: SchemaType.WORKFLOW,
            job,
            id: job.title.toLowerCase().replaceAll(' ', '_'),
            title: `${job.title} - Workflow`,
            description: job.description || `Workflow of ${job.title}`,
            url: "",
            themes: []
        } as WorkflowInfo;
    }

    const initExperimentSchemaType = (job: OpenEOJob): ExperimentInfo => {
        return {
            type: SchemaType.EXPERIMENT,
            job,
            id: job.title.toLowerCase().replaceAll(' ', '_'),
            title: `${job.title} - Experiment`,
            description: job.description || `Experiment of ${job.title}`,
            license: "",
            product: initProductSchemaType(job),
            workflow: initWorkflowSchemaType(job),
            themes: []
        } as ExperimentInfo;
    }

    const initSchemaType = (type: SchemaType, job: OpenEOJob): undefined | ProductInfo | ExperimentInfo => {
        if (type === SchemaType.PRODUCT) {
            return initProductSchemaType(job);
        } else if (type === SchemaType.EXPERIMENT) {
            return initExperimentSchemaType(job);
        } else if (type === SchemaType.WORKFLOW) {
            return initWorkflowSchemaType(job);
        } else {
            return undefined
        }
    }

    const isProductSchemaValid = (schema: ProductInfo, isChild: boolean = false): boolean => {
        return schema && !!schema.id && (isChild || !!schema.project) && !!schema.title && !!schema.description && (isChild || schema.themes.length > 0);
    }

    const isWorkflowSchemaValid = (schema: WorkflowInfo, isChild: boolean = false): boolean => {
        return schema && !!schema.id && (isChild || !!schema.project) && !!schema.title && !!schema.description && !!schema.url && (isChild || schema.themes.length > 0);
    }

    const isExperimentSchemaValid = (schema: ExperimentInfo): boolean => {
        return schema && !!schema.id && !!schema.project && !!schema.title && !!schema.description && schema.themes.length > 0 && isProductSchemaValid(schema.product, true) && isWorkflowSchemaValid(schema.workflow, true);

    }

    const isSchemaValid = (schema: ProductInfo | ExperimentInfo): boolean => {
        if (schema.type === SchemaType.PRODUCT) {
            return isProductSchemaValid(schema as ProductInfo);
        } else if (schema.type === SchemaType.WORKFLOW) {
            return isWorkflowSchemaValid(schema as WorkflowInfo);
        } else if (schema.type === SchemaType.EXPERIMENT) {
            return isExperimentSchemaValid(schema as ExperimentInfo);
        } else {
            return false;
        }
    }

    const handleJobSchemaChange = useCallback((job: OpenEOJob, type: SchemaType) => {
        const schema = initSchemaType(type, job);
        if (schema) {
            setJobSchemas((prev) => {
                const existingSchemas = prev.filter((s) => s.job.id !== job.id);
                return [
                    ...existingSchemas,
                    schema
                ]
            });
        }
    }, []);

    const handleFormChange = useCallback((schema: ProductInfo | ExperimentInfo, key: any, value: any) => {
        setJobSchemas((prev) =>
            prev.map((s) =>
                s.job.id === schema.job.id && s.type === schema.type
                    ? {...s, [key]: value}
                    : s
            )
        );
    }, []);

    return (projectsLoading || themesLoading) ? <Loading/> : (
        <div className="flex flex-col">
            <div className="font-bold">Summary</div>
            <div className="flex flex-col gap-2 my-5">
                {jobs.map((job, idx) => (
                    <div
                        key={job.id}
                        className="flex items-center flex-col gap-2 border-2 border-primary shadow-lg rounded-lg"
                        data-testid="job-summary"
                    >
                        <JobSummary job={job} selectedSchema={jobSchemas.filter(s => s.job === job).map(s => s.type)[0]}
                                    onSchemaChange={handleJobSchemaChange}/>
                        {jobSchemas.some((s) => s.job.id === job.id) && (
                            <div className="my-2 mb-5 w-full px-5">
                                {jobSchemas
                                    .filter((s) => s.job.id === job.id)
                                    .map((s) => (
                                        <JobSchemaForm schema={s}
                                                       projects={projects}
                                                       themes={themes}
                                                       onFormChange={handleFormChange}
                                                       key={`schema_form_${job.id}`}
                                        />
                                    ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>
            <Button
                onClick={publishJobs}
                color="primary"
                variant="contained"
                disabled={loading || jobSchemas.length === 0 || jobSchemas.some((s) => !isSchemaValid(s))}
                data-testid="publish-button"
                className="my-2"
            >
                {loading ? <CircularProgress size='30px' color="inherit"/> : "Publish"}
            </Button>
            <LinearProgress variant="determinate" color={error ? 'error' : 'primary'} value={progress}
                            className="w-full min-h-2 my-2 rounded-full"/>
            {error && <Alert severity="error">{error}</Alert>}
            {status && !error && <Alert severity={done ? "success" : "info"}>{status}</Alert>}
        </div>
    );
};
