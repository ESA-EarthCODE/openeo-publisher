'use client';

import {getOctokit, GITHUB_OWNER, GITHUB_REPO} from "./index";
import {EarthCODEProduct, EarthCODEWorkflow} from "../earthcode/concepts.models";


export const createFile = async (token: string, branch: string, path: string, message: string, item: EarthCODEProduct | EarthCODEWorkflow) => {
    if (GITHUB_OWNER && GITHUB_REPO) {
        const content = Buffer.from(JSON.stringify(item, null, 2)).toString('base64');

        await getOctokit(token).rest.repos.createOrUpdateFileContents({
            owner: GITHUB_OWNER,
            repo: GITHUB_REPO,
            path,
            message,
            content,
            branch
        });
    } else {
        throw Error('GitHub repository not configured!');
    }
}

export const getFile = async (token: string, path: string, branch: string) => {

    if (GITHUB_OWNER && GITHUB_REPO) {
        const {data: fileData} = await getOctokit(token).repos.getContent({
            owner: GITHUB_OWNER,
            repo: GITHUB_REPO,
            path,
            ref: branch,
        });

        return {
            sha: (fileData as any).sha,
            content: JSON.parse(Buffer.from((fileData as any).content, "base64").toString('utf-8')),
        };

    } else {
        throw Error('GitHub repository not configured!');
    }
}


export const updateFile = async (token: string, path: string, branch: string, sha: string, message: string, content: any) => {
    if (GITHUB_OWNER && GITHUB_REPO) {
        const contentBase64 = Buffer.from(JSON.stringify(content, null, 2)).toString('base64');
        await getOctokit(token).repos.createOrUpdateFileContents({
            owner: GITHUB_OWNER,
            repo: GITHUB_REPO,
            path,
            message,
            content: contentBase64,
            sha,
            branch,
        });
    } else {
        throw Error('GitHub repository not configured!');
    }
}