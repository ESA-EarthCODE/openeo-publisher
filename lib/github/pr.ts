'use client';

import {OpenEOBackend, OpenEOJob} from "../openeo/jobs.models";
import {getOctokit, GITHUB_OWNER, GITHUB_REPO} from "./index";


export const createPR = async (token: string, branch: string, backend: OpenEOBackend, jobs: OpenEOJob[]) => {
    if (GITHUB_OWNER && GITHUB_REPO) {
        await getOctokit(token).rest.pulls.create({
            owner: GITHUB_OWNER,
            repo: GITHUB_REPO,
            title: `${backend.title} - Experiment Publishing` ,
            head: branch,
            base: 'main',
            body: `Publishing of the following openEO experiments:\n\n${jobs.map((j: OpenEOJob) => `- ${j.title} (${j.id})`).join('\n')}`,
        });

    } else {
        throw Error('GitHub repository not configured!');
    }
}

