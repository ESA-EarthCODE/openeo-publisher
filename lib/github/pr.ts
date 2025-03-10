'use client';

import {OpenEOBackend, OpenEOJob} from "../openeo/jobs.models";
import {getOctokit, GITHUB_OWNER, GITHUB_REF_BRANCH, GITHUB_REPO} from "./index";


export const createPR = async (token: string, branch: string, backend: OpenEOBackend, jobs: OpenEOJob[]) => {
    if (GITHUB_OWNER && GITHUB_REPO) {
        await getOctokit(token).rest.pulls.create({
            owner: GITHUB_OWNER,
            repo: GITHUB_REPO,
            title: `${backend.title} - Publishing Results` ,
            head: branch,
            base: GITHUB_REF_BRANCH,
            body: `Publishing of the following openEO experiments:\n\n${jobs.map((j: OpenEOJob) => `- ${j.title} (${j.id})`).join('\n')}`,
        });

    } else {
        throw Error('GitHub repository not configured!');
    }
}

