import {createBranch, deleteBranch} from "../github/branches";
import {JobSchemaInfo, SchemaType} from "./schema.model";
import {getOpenEOJobResults} from "../openeo/jobs";
import {OpenEOBackend} from "../openeo/jobs.models";
import {createProductCollection} from "./schema";
import {createFile, getFile, updateFile} from "../github/files";
import {createPR} from "../github/pr";
import {projectExists} from "../github/projects";


export const publishSchemas = async function*(token: string, branch: string, backend: OpenEOBackend, schemas: JobSchemaInfo[]) {

    let stepCount = 1;
    const products: JobSchemaInfo[] = [];
    const projects: { project: string, schemas: JobSchemaInfo[]}[] = schemas.reduce((list, s) => {
       const hit = list.find(i => i.project === s.project);
       if (hit) {
           hit.schemas.push(s);
       } else {
           list.push({project: s.project, schemas: [s]})
       }
       return list;
    }, [] as {project: string, schemas: JobSchemaInfo[]}[]);
    const steps = (schemas.length * 2) + projects.length + 3;

    const getProgress = () => Math.round(((stepCount++) / steps) * 100);

    if (!token || !branch || !backend || !schemas) {
        yield { status: "error", message: "Missing or invalid parameters", progress: 0 };
        return;
    }

    yield { status: 'processing', message: "Creating branch", progress: getProgress()};
    await createBranch(token, branch);

    try {
        let jobIdx = 1;
        for (const schema of schemas) {
            yield { status: "processing", message: `Fetching job info for ${schema.job.title} (${jobIdx}/${schemas.length})`, progress: getProgress() };
            const details = await getOpenEOJobResults(backend, schema.job.id);

            if (schema.type === SchemaType.PRODUCT) {
                yield { status: "progress", message: `Processing product ${schema.id}`, progress: getProgress() };
                const product = createProductCollection(schema.id, schema.project, details);
                await createFile(
                    token,
                    branch,
                    `products/${schema.id}/collection.json`,
                    `Added product from openEO job ${schema.job.title} (${schema.job.id})`,
                    product
                );
                products.push(schema);
            }
            jobIdx++;
        }

        if (products.length > 0) {
            yield { status: "progress", message: `Registering ${products.length} products in parent catalog`, progress: getProgress() };
            await registerParentCatalogue(token, 'products/catalog.json', branch, schemas.filter(s => s.type === SchemaType.PRODUCT));

        } else {
            yield { status: "progress", message: `No products found to register in parent catalog`, progress: getProgress() };
        }

        for (const project of projects) {
            yield { status: "progress", message: `Registering project ${project.project}`, progress: getProgress() };
            await registerProject(token, branch, project.project, project.schemas);
        }

        yield { status: "progress", message: "Creating PR...", progress: getProgress() };
        await createPR(token, branch, backend, schemas.map(s => s.job));

        yield { status: "complete", message: "Publishing complete!", progress: 100};

    } catch (error) {
        yield { status: "error", message: `Failed to publish to EarthCODE Open Science Catalog: ${error}`, progress: 0 };
        await deleteBranch(token, branch);
    }
}

const registerParentCatalogue = async (token: string, path: string, branch: string, schemas: JobSchemaInfo[]) => {

    const {sha, content} = await getFile(token, path, branch);

    for (const schema of schemas) {
        content.links.push({
            rel: "child",
            href: `./${schema.id}/collection.json`,
            type: "application/json",
            title: schema.job.title
        })
    }


    await updateFile(token, path, branch, sha, 'Updated parent collection', content);
}

const registerProject = async(token: string, branch: string, project: string, schemas: JobSchemaInfo[]) => {
    if(!await projectExists(token, project)) {
        console.warn(`Trying to register non existing project ${project}`);
    } else {
        await registerParentCatalogue(token, `projects/${project}/collection.json`, branch, schemas)
    }
}