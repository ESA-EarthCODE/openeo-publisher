'use client';

import {OpenEOJobDetails} from "../openeo/jobs.models";
import {getOctokit, GITHUB_OWNER, GITHUB_REPO} from "./index";
import {EarthCODEProduct} from "../earthcode/product.models";


export const createFile = async (token: string, branch: string, path: string, message: string, item: EarthCODEProduct) => {
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
