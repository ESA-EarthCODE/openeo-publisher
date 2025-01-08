import {OpenEOJobDetails} from "../openeo/models";
import {GITHUB_OWNER, GITHUB_REPO, octokit} from "./index";


export const createFile = async (branch: string, path: string, job: OpenEOJobDetails) => {
    if (GITHUB_OWNER && GITHUB_REPO) {
        const content = Buffer.from(JSON.stringify(job, null, 2)).toString('base64');

        await octokit.rest.repos.createOrUpdateFileContents({
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
