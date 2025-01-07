import {OpenEOBackend} from "../../lib/openeo/models";

export type OpenEOState = {
    selectedBackend: OpenEOBackend |  undefined;
    setSelectedBackend: (selectedBackend: OpenEOBackend | undefined) => void;
};
