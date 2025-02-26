import { createFile } from "lib/github/files";
import { ExperimentInfo } from "../schema.model";
import { createExperimentCollection } from "../schema";

export const publishExperiment = async (
    schema: ExperimentInfo,
    token: string,
    branch: string
) => {
    const experiment = createExperimentCollection(
        schema.id, schema.title, schema.description, schema.license, schema.workflow.id, schema.product.id
    );

    await createFile(
        token,
        branch,
        `experiments/${experiment.id}/record.json`,
        `Added experiment based on openEO job ${schema.job.title} (${schema.job.id})`,
        experiment
    );
};
