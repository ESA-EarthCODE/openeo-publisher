import {Alert, Button, LinearProgress} from "@mui/material";
import {OpenEOBackend, OpenEOJob} from "../../lib/openeo/jobs.models";
import React, {useCallback, useState, useTransition} from "react";
import moment from "moment";
import {useSession} from "next-auth/react";
import {useToastStore} from "../../store/toasts";
import {JobSchemaInfo, SchemaType} from "../../lib/earthcode/schema.model";
import {JobSummary} from "@/components/Publish/JobSummary";
import {JobSchemaForm} from "@/components/Publish/JobSchemaForm";
import {Loading} from "@/components/Loading";
import {useGitHubProjects} from "../../hooks/useGitHubProjects";
import {publishSchemas} from "../../lib/earthcode/publish";

interface PublishProps {
    jobs: OpenEOJob[];
    backend: OpenEOBackend;
}


export const Publish = ({backend, jobs}: PublishProps) => {
    const [status, setStatus] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [done, setDone] = useState<boolean>(false);
    const [progress, setProgress] = useState<number>(0);
    const [jobSchemas, setJobSchemas] = useState<JobSchemaInfo[]>([]);
    const {data: session} = useSession();
    const {data: projects, loading: projectsLoading} = useGitHubProjects(session?.accessToken);
    const [_, startTransition] = useTransition();
    const {addToast} = useToastStore();

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

        startTransition(async () => {
            const branch = `openeo-publish-${moment().format("YYYY-MM-DD-HH-mm-ss-SSS")}`;
            for await (const {status, message, progress} of publishSchemas(token, branch, backend, jobSchemas)) {
                setProgress(progress);
                if (status === 'error') {
                    setError(message)
                } else {
                    setStatus(message);
                }
                if (status === 'complete') {
                    setDone(true);
                }
            }
        });
    };

    const handleJobSchemaChange = useCallback((job: OpenEOJob, value: SchemaType[]) => {
        setJobSchemas((prev) => {
            const newSchemas = prev.filter((s) => s.job.id !== job.id);
            return [
                ...newSchemas,
                ...value.map((type) => ({
                    type,
                    job,
                    id: job.title.toLowerCase().replaceAll(' ', '_'),
                    project: "",
                    valid: false
                }))
            ];
        });
    }, []);

    const handleFormChange = useCallback((schema: JobSchemaInfo, key: "id" | "project", value: string) => {
        setJobSchemas((prev) =>
            prev.map((s) =>
                s.job.id === schema.job.id && s.type === schema.type
                    ? {...s, [key]: value}
                    : s
            )
        );
    }, []);

    return projectsLoading ? <Loading/> : (
        <div className="flex flex-col">
            <div className="font-bold">Summary</div>
            <div className="flex flex-col gap-2 my-5">
                {jobs.map((job, idx) => (
                    <div
                        key={job.id}
                        className="flex items-center flex-col gap-2 border-2 border-primary shadow-lg rounded-lg"
                        data-testid="job-summary"
                    >
                        <JobSummary job={job} selectedSchemas={jobSchemas.filter(s => s.job === job).map(s => s.type)}
                                    onSchemaChange={handleJobSchemaChange}/>
                        {jobSchemas.some((s) => s.job.id === job.id) && (
                            <div key={`schema_forms`} className="my-2 mb-5 w-full px-5">
                                {jobSchemas
                                    .filter((s) => s.job.id === job.id)
                                    .map((s) => (
                                        <JobSchemaForm schema={s}
                                                       projects={projects}
                                                       onFormChange={handleFormChange}/>
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
                disabled={jobSchemas.length === 0 || jobSchemas.some((s) => !s.id || !s.project)}
                data-testid="publish-button"
                className="my-2"
            >
                Publish
            </Button>
            <LinearProgress variant="determinate" color={error ? 'error' : 'primary'} value={progress}
                            className="w-full min-h-2 my-2 rounded-full"/>
            {error && <Alert severity="error">{error}</Alert>}
            {status && !error && <Alert severity={done ? "success" : "info"}>{status}</Alert>}
        </div>
    );
};
