import {OpenEOBackend, OpenEOCredentialsProvider} from "../../lib/openeo/models";

export type OpenEOState = {
    backends: OpenEOBackend[],
    setOpenEOBackends: (backends: OpenEOBackend[]) => void,
    credentialProviders: Record<string, OpenEOCredentialsProvider[]>,
    setCredentialProviders: (backendId: string, credentialProviders: OpenEOCredentialsProvider[]) => void,
    selectedBackend: OpenEOBackend |  undefined;
    setSelectedBackend: (selectedBackend: OpenEOBackend | undefined) => void;
};
