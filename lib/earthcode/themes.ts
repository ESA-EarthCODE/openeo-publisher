'use client';

import { getFile } from "lib/github/files";
import {GITHUB_REF_BRANCH} from "lib/github";
import {EarthCODEProjectInfo, EarthCODEThemeInfo} from "./concepts.models";
import {getProjects} from "./projects";


export const getThemes = async (token: string): Promise<EarthCODEThemeInfo[]> => {
    const {content} = await getFile(token, 'themes/catalog.json', GITHUB_REF_BRANCH);
    return (content.links || [])
        .filter((p: any) => p.rel === 'child')
        .map((p: any) => ({
            id: p.href.split('/')[1],
            title: p.title
        }))
}

export const themeExists = async (token: string, themeId: string) => {
    return !!(await getThemes(token)).find((t: EarthCODEThemeInfo) => t.id === themeId);
}