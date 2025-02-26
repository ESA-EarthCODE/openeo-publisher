import {createBranch, deleteBranch} from "../github/branches";
import {ExperimentInfo, JobSchemaInfo, ProductInfo, SchemaType, WorkflowInfo} from "./schema.model";
import {getOpenEOJobResults} from "../openeo/jobs";
import {OpenEOBackend} from "../openeo/jobs.models";
import {createExperimentCollection, createProductCollection, createWorkflowCollection} from "./schema";
import {createFile, getFile, updateFile} from "../github/files";
import {createPR} from "../github/pr";
import {projectExists} from "../github/projects";


export const publishProduct = async (schema: ProductInfo, backend: OpenEOBackend, token: string, branch: string) => {
    const results = await getOpenEOJobResults(backend, schema.job.id);
    const product = createProductCollection(schema.id, schema.title, schema.description, schema.project, results);
    await createFile(
        token,
        branch,
        `products/${product.id}/collection.json`,
        `Added product from openEO job ${schema.job.title} (${schema.job.id})`,
        product
    );
}

export const publishWorkflow = async (schema: WorkflowInfo, experiments: string[], token: string, branch: string) => {
    const workflow = createWorkflowCollection(schema.id, schema.title, schema.description, schema.project, schema.url, experiments);
    await createFile(
        token,
        branch,
        `workflows/${workflow.id}/record.json`,
        `Added workflow from openEO job ${schema.job.title} (${schema.job.id})`,
        workflow
    );
}

export const publishExperiment = async (schema: ExperimentInfo, token: string, branch: string) => {
    const experiment = createExperimentCollection(schema.id, schema.title, schema.description, schema.license, schema.workflow.id, schema.product.id);
    await createFile(
        token,
        branch,
        `experiments/${experiment.id}/record.json`,
        `Added experiment based on openEO job ${schema.job.title} (${schema.job.id})`,
        experiment
    );
}

export const publishSchemas = async function* (token: string, branch: string, backend: OpenEOBackend, schemas: JobSchemaInfo[]) {

    let stepCount = 1;
    const products: ProductInfo[] = [];
    const workflows: WorkflowInfo[] = [];
    const experiments: ExperimentInfo[] = [];
    const projects: { project: string, schemas: JobSchemaInfo[] }[] = schemas.reduce((list, s) => {
        const hit = list.find(i => i.project === s.project);
        if (hit) {
            hit.schemas.push(s);
        } else {
            list.push({project: s.project, schemas: [s]})
        }
        return list;
    }, [] as { project: string, schemas: JobSchemaInfo[] }[]);
    const steps = (schemas.length * 2) + projects.length + 3;

    const getProgress = () => Math.round(((stepCount++) / steps) * 100);

    if (!token || !branch || !backend || !schemas) {
        yield {status: "error", message: "Missing or invalid parameters", progress: 0};
        return;
    }

    yield {status: 'processing', message: "Creating branch", progress: getProgress()};
    await createBranch(token, branch);

    try {
        let jobIdx = 1;
        for (const schema of schemas) {
            yield {
                status: "processing",
                message: `Fetching job info for ${schema.job.title} (${jobIdx}/${schemas.length})`,
                progress: getProgress()
            };

            if (schema.type === SchemaType.PRODUCT) {
                yield {status: "progress", message: `Processing product ${schema.id}`, progress: getProgress()};
                await publishProduct(schema as ProductInfo, backend, token, branch);
                products.push(schema as ProductInfo);
            } else if (schema.type === SchemaType.WORKFLOW) {
                yield {status: "progress", message: `Processing workflow ${schema.id}`, progress: getProgress()};
                await publishWorkflow(schema as WorkflowInfo, [], token, branch);
                workflows.push(schema as WorkflowInfo);
            } else if (schema.type === SchemaType.EXPERIMENT) {
                yield {status: "progress", message: `Processing experiment ${schema.id}`, progress: getProgress()};

                await publishProduct((schema as ExperimentInfo).product as ProductInfo, backend, token, branch);
                products.push((schema as ExperimentInfo).product);

                await publishWorkflow((schema as ExperimentInfo).workflow as WorkflowInfo, [schema.id], token, branch);
                workflows.push((schema as ExperimentInfo).workflow);

                await publishExperiment(schema as ExperimentInfo, token, branch);
                experiments.push(schema as ExperimentInfo);
            }
            jobIdx++;
        }

        if (products.length > 0) {
            yield {
                status: "progress",
                message: `Registering ${products.length} products in parent catalog`,
                progress: getProgress()
            };
            await registerParentCatalogue(token, 'products/catalog.json', 'collection.json', branch, products);

        } else {
            yield {
                status: "progress",
                message: `No products found to register in parent catalog`,
                progress: getProgress()
            };
        }

        if (workflows.length > 0) {
            yield {
                status: "progress",
                message: `Registering ${workflows.length} workflows in parent catalog`,
                progress: getProgress()
            };
            await registerParentCatalogue(token, 'workflows/catalog.json', 'record.json', branch, workflows);

        } else {
            yield {
                status: "progress",
                message: `No workflows found to register in parent catalog`,
                progress: getProgress()
            };
        }

        if (experiments.length > 0) {
            yield {
                status: "progress",
                message: `Registering ${experiments.length} experiments in parent catalog`,
                progress: getProgress()
            };
            await registerParentCatalogue(token, 'experiments/catalog.json', 'record.json', branch, workflows);

        } else {
            yield {
                status: "progress",
                message: `No workflows found to register in parent catalog`,
                progress: getProgress()
            };
        }

        for (const project of projects) {
            yield {status: "progress", message: `Registering project ${project.project}`, progress: getProgress()};
            await registerProject(token, branch, project.project, project.schemas);
        }

        yield {status: "progress", message: "Creating PR...", progress: getProgress()};
        await createPR(token, branch, backend, schemas.map(s => s.job));

        yield {status: "complete", message: "Publishing complete!", progress: 100};

    } catch (error) {
        yield {status: "error", message: `Failed to publish to EarthCODE Open Science Catalog: ${error}`, progress: 0};
        await deleteBranch(token, branch);
    }
}

const registerParentCatalogue = async (token: string, path: string, filename: string, branch: string, schemas: JobSchemaInfo[]) => {

    const {sha, content} = await getFile(token, path, branch);

    for (const schema of schemas) {
        content.links.push({
            rel: "child",
            href: `./${schema.id}/${filename}`,
            type: "application/json",
            title: schema.job.title
        })
    }


    await updateFile(token, path, branch, sha, 'Updated parent collection', content);
}

const registerProject = async (token: string, branch: string, project: string, schemas: JobSchemaInfo[]) => {
    if (!await projectExists(token, project)) {
        console.warn(`Trying to register non existing project ${project}`);
    } else {
        await registerParentCatalogue(token, `projects/${project}/collection.json`, branch, schemas)
    }
}