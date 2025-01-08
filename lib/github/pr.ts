import {OpenEOBackend, OpenEOJob, OpenEOJobDetails} from "../openeo/models";
import {GITHUB_OWNER, GITHUB_REPO, octokit} from "./index";


export const createPR = async (branch: string, backend: OpenEOBackend, jobs: OpenEOJob[]) => {
    if (GITHUB_OWNER && GITHUB_REPO) {
        await octokit.rest.pulls.create({
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

