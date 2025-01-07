import {OpenEOBackend, OpenEOJob} from "./models";


export const getOpenEOJobs = async (backend: OpenEOBackend): Promise<OpenEOJob[]> => {
    const response = await fetch(`${backend.url}/jobs`);
    if (response.ok) {
        return [];
    } else {
        throw new Error(`Could not retrieve jobs from ${backend.title}: ${response.status} - ${response.statusText} - ${await response.text()}`);
    }
}