'use client';

import {OpenEOJobDetails} from "../openeo/jobs.models";
import {getOctokit, GITHUB_OWNER, GITHUB_REPO} from "./index";


export const createFile = async (token: string, branch: string, path: string, job: OpenEOJobDetails) => {
    if (GITHUB_OWNER && GITHUB_REPO) {
        const content = Buffer.from(JSON.stringify(job, null, 2)).toString('base64');

        await getOctokit(token).rest.repos.createOrUpdateFileContents({
            owner: GITHUB_OWNER,
            repo: GITHUB_REPO,
            path,
            message: `Add experiment ${job.title} with ID ${job.id}`,
            content,
            branch
        });
    } else {
        throw Error('GitHub repository not configured!');
    }
}
