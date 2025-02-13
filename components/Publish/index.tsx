import {Alert, Button, LinearProgress} from "@mui/material";
import {OpenEOBackend, OpenEOJob} from "../../lib/openeo/jobs.models";
import React, {useCallback, useState} from "react";
import {createBranch, deleteBranch} from "../../lib/github/branches";
import moment from "moment";
import {getOpenEOJobResults} from "../../lib/openeo/jobs";
import {createFile} from "../../lib/github/files";
import {createPR} from "../../lib/github/pr";
import {useSession} from "next-auth/react";
import {useToastStore} from "../../store/toasts";
import {JobSchemaInfo, SchemaType} from "../../lib/earthcode/schema.model";
import {EarthCODEProduct} from "../../lib/earthcode/product.models";
import {createProductCollection} from "../../lib/earthcode/schema";
import {OpenEOJobResults} from "../../lib/openeo/results.models";
import {JobSummary} from "@/components/Publish/JobSummary";
import {JobSchemaForm} from "@/components/Publish/JobSchemaForm";

interface PublishProps {
    jobs: OpenEOJob[];
    backend: OpenEOBackend;
}


export const Publish = ({backend, jobs}: PublishProps) => {
    const [status, setStatus] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [done, setDone] = useState<boolean>(false);
    const [progress, setProgress] = useState<number>(0);
    const [jobSchemasProcessing, setJobSchemasProcessing] = useState<JobSchemaInfo[]>([]);
    const [jobSchemasDone, setJobSchemasDone] = useState<JobSchemaInfo[]>([]);
    const [jobSchemas, setJobSchemas] = useState<JobSchemaInfo[]>([]);
    const {data: session} = useSession();
    const {addToast} = useToastStore();

    const steps = jobs.length + 2;
    let stepCount = 1;

    const updateProgress = () => setProgress(Math.round(((stepCount++) / steps) * 100));

    const setJobSchemaProcessing = (schema: JobSchemaInfo) => {
        setJobSchemasProcessing((prev) => [...prev, schema]);
        setJobSchemasDone((prev) => prev.filter((j) => j.id !== schema.id));
    };

    const setJobSchemaDone = (schema: JobSchemaInfo) => {
        setJobSchemasDone((prev) => [...prev, schema]);
        setJobSchemasProcessing((prev) => prev.filter((j) => j.id !== schema.id));
    };

    const publishJobs = async () => {
        const token = (session as any)?.accessToken;

        if (!token) {
            addToast({
                message: "You are not authenticated with GitHub. Please refresh the page.",
                severity: "error"
            });
            return;
        }

        try {
            setError(null);
            setProgress(1);
            setDone(false);

            const branch = `openeo-publish-${moment().format("YYYY-MM-DD-HH-mm-ss-SSS")}`;

            setStatus("Creating branch");
            await createBranch(token, branch);
            updateProgress();

            try {

                let jobIdx = 1;
                for (const schema of jobSchemas) {
                    setStatus(`Fetching job information from ${schema.job.title} (${jobIdx}/${jobSchemas.length})`);
                    setJobSchemaProcessing(schema);

                    const details: OpenEOJobResults = await getOpenEOJobResults(backend, schema.job.id);
                    if (schema.type === SchemaType.PRODUCT) {
                        const product: EarthCODEProduct = createProductCollection(schema.id, schema.project, details);
                        await createFile(token, branch, `products/${schema.id}/collection.json`, `Added product from openEO job ${schema.job.title} (${schema.job.id})`, product);
                    }

                    updateProgress();
                    setJobSchemaDone(schema);
                    jobIdx++;
                }

                setStatus("Creating PR");
                await createPR(token, branch, backend, jobs);
            } catch (e) {
                console.error(`Something went wrong while publishing, deleting branch ${branch}`);
                await deleteBranch(token, branch);
            }

            setStatus("Publishing complete");
            setProgress(100);
            setDone(true);
        } catch (e: any) {
            setError(e.message);
        }
    };

    const getSchemaStatus = (schema: JobSchemaInfo): 'none' | 'processing' | 'done' => {
        if (jobSchemasProcessing.includes(schema)) return 'processing';
        if (jobSchemasDone.includes(schema)) return 'done';
        return 'none';
    };

    const handleJobSchemaChange = useCallback((job: OpenEOJob, value: SchemaType[]) => {
        setJobSchemas((prev) => {
            const newSchemas = prev.filter((s) => s.job.id !== job.id);
            return [
                ...newSchemas,
                ...value.map((type) => ({
                    type,
                    job,
                    id: `${job.id}_${type.toLowerCase()}`,
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
                    ? {...s, [key]: value, valid: !!s.id && !!s.project}
                    : s
            )
        );
    }, []);

    return (
        <div className="flex flex-col">
            <div className="font-bold">Summary</div>
            <div className="flex flex-col gap-2 my-5">
                {jobs.map((job, idx) => (
                    <div
                        key={job.id}
                        className="flex items-center flex-col gap-2 border-2 border-neutral-100 rounded-lg"
                        data-testid="job-summary"
                    >
                        <JobSummary job={job} selectedSchemas={jobSchemas.filter(s => s.job === job).map(s => s.type)}
                                    onSchemaChange={handleJobSchemaChange}/>
                        {jobSchemas.some((s) => s.job.id === job.id) && (
                            <div key={`schema_forms`} className="my-2 w-full px-5">
                                {jobSchemas
                                    .filter((s) => s.job.id === job.id)
                                    .map((s) => (
                                        <JobSchemaForm schema={s} status={getSchemaStatus(s)}
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
                disabled={jobSchemas.length === 0 || jobSchemas.some((s) => !s.valid)}
                data-testid="publish-button"
                className="my-2"
            >
                Index
            </Button>
            <LinearProgress variant="determinate" value={progress} className="w-full min-h-2 my-2 rounded-full"/>
            {error && <Alert severity="error">{error}</Alert>}
            {status && !error && <Alert severity={done ? "success" : "info"}>{status}</Alert>}
        </div>
    );
};
