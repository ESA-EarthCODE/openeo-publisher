import {Octokit} from "@octokit/rest";

export const octokit = new Octokit({ auth: process.env.NEXT_PUBLIC_GITHUB_TOKEN });
export const GITHUB_OWNER = process.env.NEXT_PUBLIC_GITHUB_OWNER;
export const GITHUB_REPO = process.env.NEXT_PUBLIC_GITHUB_REPO;
