"use client";

import { OpenEOBackend, OpenEOJob } from "../openeo/jobs.models";
import {
  getOctokit,
  GITHUB_OWNER,
  GITHUB_REF_BRANCH,
  GITHUB_REPO,
} from "./index";

export const createPR = async (
  token: string,
  branch: string,
  backend: OpenEOBackend,
  jobs: OpenEOJob[]
): Promise<string> => {
  if (GITHUB_OWNER && GITHUB_REPO) {
    const { data } = await getOctokit(token).rest.pulls.create({
      owner: GITHUB_OWNER,
      repo: GITHUB_REPO,
      title: `${backend.title} - Publishing Results`,
      head: branch,
      base: GITHUB_REF_BRANCH,
      body: `Publishing of the following openEO experiments:\n\n${jobs
        .map((j: OpenEOJob) => `- ${j.title} (${j.id})`)
        .join("\n")}`,
    });

    return data.html_url;
  } else {
    throw Error("GitHub repository not configured!");
  }
};
