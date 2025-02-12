'use client';

import {Octokit} from "@octokit/rest";


let octokit: Octokit;

export const getOctokit = (token: string) => {
    if (!octokit) {
        octokit = new Octokit();
    }
    return octokit;
}

export const GITHUB_OWNER = process.env.NEXT_PUBLIC_GITHUB_OWNER;
export const GITHUB_REPO = process.env.NEXT_PUBLIC_GITHUB_REPO;
