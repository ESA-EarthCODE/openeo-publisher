import { getOpenEOJobResults } from "lib/openeo/jobs";
import { ProductInfo } from "../schema.model";
import { OpenEOBackend } from "lib/openeo/jobs.models";
import { createProductCollection } from "../schema";
import { createFile } from "lib/github/files";
import {EarthCODEProduct} from "../concepts.models";

export const publishProduct = async (
    schema: ProductInfo,
    backend: OpenEOBackend,
    token: string,
    branch: string
): Promise<EarthCODEProduct> => {
    const results = await getOpenEOJobResults(backend, schema.job.id);
    const product = createProductCollection(
        schema.id, schema.title, schema.description, schema.project || {id: '', title: ''}, schema.themes, results
    );

    await createFile(
        token,
        branch,
        `products/${product.id}/collection.json`,
        `Added product from openEO job ${schema.job.title} (${schema.job.id})`,
        product
    );
    return product
};
