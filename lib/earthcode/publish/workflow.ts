import {WorkflowInfo} from "../schema.model";
import {createWorkflowCollection} from "../schema";
import {createJSONFile} from "lib/github/files";
import {EarthCODEWorkflow} from "../concepts.models";

export const publishWorkflow = async (
    schema: WorkflowInfo,
    experiments: string[],
    token: string,
    branch: string
): Promise<EarthCODEWorkflow> => {
    const workflow = createWorkflowCollection(
        schema.id, schema.title, schema.description, schema.project || {
        id: '',
        title: ''
    }, schema.themes, schema.url, experiments
    );

    await createJSONFile(
        token,
        branch,
        `workflows/${workflow.id}/record.json`,
        `Added workflow from openEO job ${schema.job.title} (${schema.job.id})`,
        workflow
    );
    return workflow;
};