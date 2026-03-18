import {getOpenEOJobResults} from "lib/openeo/jobs";
import {ProductInfo} from "../schema.model";
import {OpenEOBackend} from "lib/openeo/jobs.models";
import {createProductCollection} from "../schema";
import {createJSONFile} from "lib/github/files";
import {EarthCODEProduct} from "../concepts.models";
import {uploadPublicFileToS3} from "./storage";

const PRODUCT_ASSETS_BUCKET = "products";

export const publishProduct = async (
    schema: ProductInfo,
    backend: OpenEOBackend,
    token: string,
    branch: string
): Promise<EarthCODEProduct> => {
    const results = await getOpenEOJobResults(backend, schema.job.id);

    const copiedAssets = await Promise.all(
        schema.assets.map(async (asset) => {
            const uploadedUrl = await uploadPublicFileToS3(
                asset.url,
                `${schema.id}`,
                PRODUCT_ASSETS_BUCKET,
                true
            );

            return {
                ...asset,
                url: uploadedUrl,
            };
        })
    );

    const product = createProductCollection(
        schema.id, schema.title, schema.description, schema.project || {id: '', title: ''}, schema.themes, copiedAssets, results
    );
    await createJSONFile(
        token,
        branch,
        `products/${product.id}/collection.json`,
        `Added product from openEO job ${schema.job.title} (${schema.job.id})`,
        product
    );
    return product
};
