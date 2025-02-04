import {Link, OpenEOJobResults} from "../openeo/results.models";
import {EarthCODEProduct} from "./product.models";

export const createProductCollection = (id: string, project: string, job: OpenEOJobResults): EarthCODEProduct => {
    return {
        assets: job.assets,
        description: job.description,
        extent: job.extent,
        id,
        license: job.license,
        links: [
            ...job.links.map((l: Link)=> (
                {
                    ...l,
                    rel: l.rel === 'canonical' ? 'via' : l.rel,
                }
            )),
            {
                "rel": "parent",
                "href": "../catalog.json",
                "type": "application/json",
                "title": "Products"
            },
            {
                "rel": "root",
                "href": "../../catalog.json",
                "type": "application/json",
                "title": "Open Science Catalog"
            }
        ],
        stac_extensions: [
            "https://stac-extensions.github.io/osc/v1.0.0-rc.3/schema.json",
        ],
        stac_version: job.stac_version,
        title: job.title,
        type: job.type,
        "osc:missions": [],
        "osc:project": project,
        "osc:status": "completed",
        "osc:type": "product",
        "osc:variables": []
    }
}