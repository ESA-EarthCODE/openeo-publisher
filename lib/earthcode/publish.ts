import {createBranch, deleteBranch} from "../github/branches";
import {JobSchemaInfo, SchemaType} from "./schema.model";
import {getOpenEOJobResults} from "../openeo/jobs";
import {OpenEOBackend} from "../openeo/jobs.models";
import {createProductCollection} from "./schema";
import {createFile} from "../github/files";
import {createPR} from "../github/pr";



export const publishSchemas = async function*(token: string, branch: string, backend: OpenEOBackend, schemas: JobSchemaInfo[]) {

    const steps = schemas.length + 2;
    let stepCount = 1;
    let progress = 1;

    const updateProgress = () => progress = Math.round(((stepCount++) / steps) * 100);

    if (!token || !branch || !backend || !schemas) {
        yield { status: "error", message: "Missing or invalid parameters", progress: 0 };
        return;
    }

    yield { status: 'processing', message: "Creating branch", progress};
    await createBranch(token, branch);

    try {
        let jobIdx = 1;
        for (const schema of schemas) {
            yield { status: "processing", message: `Fetching job info for ${schema.job.title} (${jobIdx}/${schemas.length})`, progress };

            const details = await getOpenEOJobResults(backend, schema.job.id);

            if (schema.type === SchemaType.PRODUCT) {
                yield { status: "progress", message: `Processing product ${schema.id}`, progress };
                const product = createProductCollection(schema.id, schema.project, details);
                await createFile(
                    token,
                    branch,
                    `products/${schema.id}/collection.json`,
                    `Added product from openEO job ${schema.job.title} (${schema.job.id})`,
                    product
                );
            }
            updateProgress();
            jobIdx++;
        }

        yield { status: "progress", message: "Creating PR...", progress };
        await createPR(token, branch, backend, schemas.map(s => s.job));

        yield { status: "complete", message: "Publishing complete!", progress: 100};

    } catch (error) {
        yield { status: "error", message: `Failed to publish to EarthCODE Open Science Catalog: ${error}`, progress: 0 };
        await deleteBranch(token, branch);
    }

}