'use client';

import { getFile } from "lib/github/files";
import {GITHUB_REF_BRANCH} from "lib/github";
import {EarthCODEProjectInfo} from "./concepts.models";


export const getProjects = async (token: string): Promise<EarthCODEProjectInfo[]> => {
    const {content} = await getFile(token, 'projects/catalog.json', GITHUB_REF_BRANCH);
    console.log("PROJECTS", content);
    return (content.links || [])
        .filter((p: any) => p.rel === 'child')
        .map((p: any) => ({
            id: p.href.split('/')[1],
            title: p.title
        }))
}

export const projectExists = async (token: string, projectId: string) => {
    return !!(await getProjects(token)).find((p: EarthCODEProjectInfo) => p.id === projectId);
}