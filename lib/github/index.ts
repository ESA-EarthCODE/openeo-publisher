"use client";

import { Octokit } from "@octokit/rest";

let octokit: Octokit;

export const getOctokit = (token: string) => {
  if (!octokit) {
    octokit = new Octokit({ auth: token });
  }
  return octokit;
};

export const GITHUB_OWNER = process.env.NEXT_PUBLIC_GITHUB_OWNER;
export const GITHUB_REPO = process.env.NEXT_PUBLIC_GITHUB_REPO;
export const GITHUB_REF_BRANCH =
  process.env.NEXT_PUBLIC_GITHUB_REF_BRANCH || "main";

export const getRawGitHubBaseUrl = () => {
  return `https://raw.githubusercontent.com/${GITHUB_OWNER}/${GITHUB_REPO}/${GITHUB_REF_BRANCH}`;
};
