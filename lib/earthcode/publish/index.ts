import {OpenEOBackend} from "lib/openeo/jobs.models";
import {ExperimentInfo, JobSchemaInfo, ProductInfo, SchemaType, WorkflowInfo} from "../schema.model";
import {createBranch, deleteBranch} from "lib/github/branches";
import {publishProduct} from "./product";
import {publishWorkflow} from "./workflow";
import {publishExperiment} from "./experiment";
import {createPR} from "lib/github/pr";
import {getFile, updateFile} from "lib/github/files";
import {projectExists} from "../projects";
import {EarthCODEProjectInfo} from "../concepts.models";


export const publishSchemas = async function* (
    token: string,
    branch: string,
    backend: OpenEOBackend,
    schemas: JobSchemaInfo[]
) {

    if (!token || !branch || !backend || !schemas.length) {
        yield {status: "error", message: "Missing or invalid parameters", progress: 0};
        return;
    }

    let stepCount = 1;
    const products: ProductInfo[] = [];
    const workflows: WorkflowInfo[] = [];
    const experiments: ExperimentInfo[] = [];

    const groupedProjects = schemas
        .reduce<{ project?: EarthCODEProjectInfo, schemas: JobSchemaInfo[] }[]>((list, schema) => {
            const existingProject = list
                .filter(i => i.project)
                .find(i => i.project?.id === schema.project?.id);
            existingProject ? existingProject.schemas.push(schema) : list.push({
                project: schema.project,
                schemas: [schema]
            });
            return list;
        }, []);

    // totalSteps = number of schemas + 3 parent catalogues + each project + create pr + offset
    const totalSteps = schemas.length + 3 + groupedProjects.length + 1 + 1;
    const getProgress = () => Math.round(((stepCount++) / totalSteps) * 100);

    if (!token || !branch || !backend || !schemas) {
        yield {status: "error", message: "Missing or invalid parameters", progress: 0};
        return;
    }

    yield {status: "processing", message: "Creating branch", progress: getProgress()};
    await createBranch(token, branch);

    try {
        // @ts-ignore
        for (const [index, schema] of schemas.entries()) {

            switch (schema.type) {
                case SchemaType.PRODUCT:
                    yield {status: "progress", message: `Processing product ${schema.id}`, progress: getProgress()};
                    await publishProduct(schema as ProductInfo, backend, token, branch);
                    products.push(schema as ProductInfo);
                    break;

                case SchemaType.WORKFLOW:
                    yield {status: "progress", message: `Processing workflow ${schema.id}`, progress: getProgress()};
                    await publishWorkflow(schema as WorkflowInfo, [], token, branch);
                    workflows.push(schema as WorkflowInfo);
                    break;

                case SchemaType.EXPERIMENT:
                    yield {status: "progress", message: `Processing experiment ${schema.id}`, progress: getProgress()};

                    const experimentSchema = schema as ExperimentInfo;

                    const product = await publishProduct({
                        ...experimentSchema.product,
                        project: experimentSchema.project
                    }, backend, token, branch);
                    products.push(experimentSchema.product);

                    const workflow = await publishWorkflow({
                        ...experimentSchema.workflow,
                        project: experimentSchema.project
                    }, [schema.id], token, branch);
                    workflows.push(experimentSchema.workflow);

                    await publishExperiment(experimentSchema, workflow, product, token, branch);
                    experiments.push(experimentSchema);
                    break;

                default:
                    console.warn(`Unknown schema type: ${schema.type}`);
            }
        }

        yield {
            status: "progress",
            message: `Registering ${schemas.length} products in parent catalog`,
            progress: getProgress()
        };
        await registerSchemas(token, branch, "products", "collection.json", products, 'child');
        yield {
            status: "progress",
            message: `Registering ${schemas.length} workflows in parent catalog`,
            progress: getProgress()
        };
        await registerSchemas(token, branch, "workflows", "record.json", workflows, 'item');
        yield {
            status: "progress",
            message: `Registering ${schemas.length} experiments in parent catalog`,
            progress: getProgress()
        };
        await registerSchemas(token, branch, "experiments", "record.json", experiments, 'item');


        for (const project of groupedProjects) {
            yield {status: "progress", message: `Registering project ${project.project}`, progress: getProgress()};
            if (project.project) {
                await registerProject(token, branch, project.project, project.schemas);
            }
        }

        yield {status: "progress", message: "Creating PR...", progress: getProgress()};
        await createPR(token, branch, backend, schemas.map(s => s.job));

        yield {status: "complete", message: "Publishing complete!", progress: 100};

    } catch (error) {
        console.error("Publishing failed:", error);
        yield {status: "error", message: `Failed to publish to EarthCODE Open Science Catalog: ${error}`, progress: 0};
        await deleteBranch(token, branch);
    }
}

const registerSchemas = async (
    token: string,
    branch: string,
    category: string,
    filename: string,
    schemas: JobSchemaInfo[],
    rel: string,
) => {
    if (!schemas.length) {
        return;
    }
    await registerParentCatalogue(token, `${category}/catalog.json`, filename, branch, schemas, rel);
};

const registerParentCatalogue = async (token: string, path: string, filename: string, branch: string, schemas: JobSchemaInfo[], rel: string) => {

    const {sha, content} = await getFile(token, path, branch);

    for (const schema of schemas) {
        content.links.push({
            rel,
            href: schema.href || `./${schema.id}/${filename}`,
            type: "application/json",
            title: schema.title
        })
    }


    await updateFile(token, path, branch, sha, 'Updated parent collection', content);
}

const registerProject = async (token: string, branch: string, project: EarthCODEProjectInfo, schemas: JobSchemaInfo[]) => {
    if (!await projectExists(token, project.id)) {
        console.warn(`Trying to register non existing project ${project.id}`);
    } else {
        await registerParentCatalogue(token, `projects/${project.id}/collection.json`, '', branch, schemas
            .filter(s => s.type === SchemaType.PRODUCT)
            .map(s => ({
                ...s,
                href: `../../${s.type.toLowerCase()}/${s.id}/${s.type === SchemaType.PRODUCT ? 'collection.json' : 'record.json'}`
            })), 'child')
    }
}