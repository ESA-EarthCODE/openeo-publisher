import {OpenEOBackend, OpenEOCredentialsProvider, OpenEOJob} from "../../lib/openeo/jobs.models";

export type OpenEOState = {
    backends: OpenEOBackend[],
    setOpenEOBackends: (backends: OpenEOBackend[]) => void,
    credentialProviders: Record<string, OpenEOCredentialsProvider[]>,
    setCredentialProviders: (backendId: string, credentialProviders: OpenEOCredentialsProvider[]) => void,
    selectedBackend: OpenEOBackend |  undefined;
    setSelectedBackend: (selectedBackend: OpenEOBackend | undefined) => void;
    selectedJobs: OpenEOJob[];
    setSelectedJobs: (selectedJobs: OpenEOJob[]) => void;
};
