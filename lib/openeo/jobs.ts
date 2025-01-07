import {OpenEOBackend, OpenEOJob} from "./models";
import {ResponseError} from "../utils/ResponseError";


export const getOpenEOJobs = async (backend: OpenEOBackend): Promise<OpenEOJob[]> => {
    const response = await fetch(`${backend.url}/jobs`, {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        }
    });
    if (response.ok) {
        return [];
    } else {
        throw new ResponseError(response.status, response.statusText, ` Could not retrieve jobs from ${backend.title}: ${await response.text()}`);
    }
}