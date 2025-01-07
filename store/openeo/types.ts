import {OpenEOBackend} from "../../lib/openeo/models";

export type OpenEOState = {
    backends: OpenEOBackend[],
    setOpenEOBackends: (backends: OpenEOBackend[]) => void,
    selectedBackend: OpenEOBackend |  undefined;
    setSelectedBackend: (selectedBackend: OpenEOBackend | undefined) => void;
};
