import {WorkflowInfo} from "../schema.model";
import {createWorkflowCollection} from "../schema";
import { createFile } from "lib/github/files";

export const publishWorkflow = async (
    schema: WorkflowInfo,
    experiments: string[],
    token: string,
    branch: string
) => {
    const workflow = createWorkflowCollection(
        schema.id, schema.title, schema.description, schema.project, schema.url, experiments
    );

    await createFile(
        token,
        branch,
        `workflows/${workflow.id}/record.json`,
        `Added workflow from openEO job ${schema.job.title} (${schema.job.id})`,
        workflow
    );
};