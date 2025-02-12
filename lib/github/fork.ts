'use client';

import {getOctokit, GITHUB_OWNER, GITHUB_REPO} from "./index";


export const createFork = async (token: string) => {
    if (GITHUB_OWNER && GITHUB_REPO) {

        // Get a reference to the main branch
        const {data } = await getOctokit(token).rest.repos.createFork({
            owner: GITHUB_OWNER,
            repo: GITHUB_REPO,
            headers: {
                "authorization": `Bearer ${token}`
            }
        });

        console.log(data);

    } else {
        throw Error('GitHub repository not configured!');
    }
}