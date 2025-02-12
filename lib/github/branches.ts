'use client';

import {getOctokit, GITHUB_OWNER, GITHUB_REPO} from "./index";


export const createBranch = async (token: string, name: string) => {
    if (GITHUB_OWNER && GITHUB_REPO) {

        // Get a reference to the main branch
        const {data } = await getOctokit(token).rest.git.getRef({
            owner: GITHUB_OWNER,
            repo: GITHUB_REPO,
            ref: `heads/main`,
        });

        const baseSha = data.object.sha;

        // Create a new branch
        await getOctokit(token).rest.git.createRef({
            owner: GITHUB_OWNER,
            repo: GITHUB_REPO,
            ref: `refs/heads/${name}`,
            sha: baseSha,
        });

    } else {
        throw Error('GitHub repository not configured!');
    }
}