'use client';

import {getOctokit, GITHUB_OWNER, GITHUB_REPO} from "./index";


export const getProjects = async (token: string) => {
    if (GITHUB_OWNER && GITHUB_REPO) {
        const response = await getOctokit(token).rest.repos.getContent({
            owner: GITHUB_OWNER,
            repo: GITHUB_REPO,
            path: '/projects'
        });

        // Filter only directories
        const folders = (Array.isArray(response.data) ? response.data : [response.data])
            .filter(item => item.type === "dir")
            .map(item => item.name);

        return folders;

    } else {
        throw Error('GitHub repository not configured!');
    }
}

