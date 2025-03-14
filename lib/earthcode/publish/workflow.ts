import {WorkflowInfo} from "../schema.model";
import {createWorkflowCollection, getExperimentLink} from "../schema";
import {createJSONFile, getFile, updateFile} from "lib/github/files";
import {EarthCODEWorkflow} from "../concepts.models";
import {workflowsExists} from "../workflows";

const getWorkflowRecordPath = (id: string) => `workflows/${id}/record.json`

export const getExistingWorkflow = async (token: string, id: string, branch: string): Promise<{sha: string, workflow: EarthCODEWorkflow}> => {
    const {sha, content} = await getFile(token, getWorkflowRecordPath(id), branch);
    return {sha, workflow: content as EarthCODEWorkflow}
}

export const publishWorkflow = async (
    schema: WorkflowInfo,
    experiments: string[],
    token: string,
    branch: string
): Promise<{existing: boolean, workflow: EarthCODEWorkflow}> => {


    if (await workflowsExists(token, schema.id)) {
        console.warn(`Skipping workflow ${schema.id} because it already exists`);
        const {sha, workflow} = await getExistingWorkflow(token, schema.id, branch);

        // Add experiments to the workflow links
        workflow.links = [...workflow.links, ...experiments.map((e) => getExperimentLink(e))];

        // Update the workflow file
        await updateFile(token, getWorkflowRecordPath(schema.id), branch, sha, 'Added experiments', workflow);

        return {existing: true, workflow};
    } else {
        const workflow = createWorkflowCollection(
            schema.id, schema.title, schema.description, schema.project || {
            id: '',
            title: ''
        }, schema.themes, schema.url, experiments);
        await createJSONFile(
            token,
            branch,
            `workflows/${workflow.id}/record.json`,
            `Added workflow from openEO job ${schema.job.title} (${schema.job.id})`,
            workflow
        );
        return {existing: false, workflow};
    }
};