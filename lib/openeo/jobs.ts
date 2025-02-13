'use client';

import {OpenEOBackend, OpenEOJob, OpenEOJobDetails} from "./jobs.models";
import {ResponseError} from "../utils/ResponseError";
import {OpenEOJobResults} from "./results.models";


export const getOpenEOJobs = async (backend: OpenEOBackend): Promise<OpenEOJob[]> => {
    const response = await fetch(`${backend.url}/jobs`, {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem(`access_token_${backend.id}`)}`
        }
    });
    if (response.ok) {
        return (await response.json()).jobs as OpenEOJob[];
    } else {
        throw new ResponseError(response.status, response.statusText, ` Could not retrieve jobs from ${backend.title}: ${await response.text()}`);
    }
}

export const getOpenEOJobDetails = async (backend: OpenEOBackend, jobId: string): Promise<OpenEOJobDetails> => {
    const response = await fetch(`${backend.url}/jobs/${jobId}`, {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem(`access_token_${backend.id}`)}`
        }
    });
    if (response.ok) {
        return (await response.json()) as OpenEOJobDetails
    } else {
        throw new ResponseError(response.status, response.statusText, ` Could not retrieve job details from ${backend.title}: ${await response.text()}`);
    }
}

export const getOpenEOJobResults = async (backend: OpenEOBackend, jobId: string): Promise<OpenEOJobResults> => {
    const response = await fetch(`${backend.url}/jobs/${jobId}/results`, {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem(`access_token_${backend.id}`)}`
        }
    });
    if (response.ok) {
        return (await response.json()) as OpenEOJobResults
    } else {
        throw new ResponseError(response.status, response.statusText, ` Could not retrieve job details from ${backend.title}: ${await response.text()}`);
    }
}
