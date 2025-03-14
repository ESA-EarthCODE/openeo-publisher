'use client';

import { getFile } from "lib/github/files";
import {GITHUB_REF_BRANCH} from "lib/github";
import {EarthCODEProjectInfo, EarthCODEThemeInfo} from "./concepts.models";
import {getProjects} from "./projects";


export const getWorkflows = async (token: string): Promise<EarthCODEThemeInfo[]> => {
    const {content} = await getFile(token, 'workflows/catalog.json', GITHUB_REF_BRANCH);
    return (content.links || [])
        .filter((p: any) => p.rel === 'item')
        .map((p: any) => ({
            id: p.href.split('/')[1],
            title: p.title
        }))
}

export const workflowsExists = async (token: string, workflowId: string) => {
    return !!(await getWorkflows(token)).find((t: EarthCODEThemeInfo) => t.id === workflowId);
}