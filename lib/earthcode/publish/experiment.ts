import {createFile, createJSONFile} from "lib/github/files";
import { ExperimentInfo } from "../schema.model";
import { createExperimentCollection } from "../schema";
import {EarthCODEExperiment, EarthCODEProduct, EarthCODEWorkflow} from "../concepts.models";

export const publishExperiment = async (
    schema: ExperimentInfo,
    workflow: EarthCODEWorkflow,
    product: EarthCODEProduct,
    token: string,
    branch: string
): Promise<EarthCODEExperiment> => {
    const experiment = createExperimentCollection(
        schema.id, schema.title, schema.description, schema.license, schema.project || {id: '', title: ''}, schema.themes, workflow, product
    );

    await createJSONFile(
        token,
        branch,
        `experiments/${experiment.id}/record.json`,
        `Added experiment based on openEO job ${schema.job.title} (${schema.job.id})`,
        experiment
    );

    await createFile(
        token,
        branch,
        `experiments/${experiment.id}/environment.yaml`,
        `Added environment.yaml based on openEO job ${schema.job.title} (${schema.job.id})`,
        "" //@TODO - Fill in enviornment yaml
    );

    await createFile(
        token,
        branch,
        `experiments/${experiment.id}/input.yaml`,
        `Added input.yaml based on openEO job ${schema.job.title} (${schema.job.id})`,
        "" //@TODO - Fill in input yaml
    );

    return experiment
};
