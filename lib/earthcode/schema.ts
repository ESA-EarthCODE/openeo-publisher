import {Link, OpenEOJobResults} from "../openeo/results.models";
import {EarthCODEExpiriment, EarthCODEProduct, EarthCODEWorkflow} from "./concepts.models";
import moment from "moment";

export const createProductCollection = (id: string, project: string, job: OpenEOJobResults): EarthCODEProduct => {
    return {
        assets: job.assets,
        description: job.description,
        extent: job.extent,
        id,
        license: job.license,
        links: [
            ...job.links.map((l: Link) => (
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

export const createWorkflowCollection = (id: string, title: string, description: string, project: string, workflowUrl: string): EarthCODEWorkflow => {
    //@TODO - Add reference to Experiment
    /**
     * {
     *       "rel": "related",
     *       "href": "../../experiments/e59e411c-20ed-4dc7-ba85-e2df001e9f0b/record.json",
     *       "type": "application/json",
     *       "title": "Experiment: POLARIS"
     *     },
     */
    return {
        type: "Feature",
        conformsTo: [
            "http://www.opengis.net/spec/ogcapi-records-1/1.0/req/record-core"
        ],
        geometry: null,
        id,
        links: [
            {
                "rel": "root",
                "href": "../../catalog.json",
                "type": "application/json",
                "title": "Open Science Catalog"
            },
            {
                "rel": "parent",
                "href": "../catalog.json",
                "type": "application/json",
                "title": "Projects"
            },
            {
                "rel": "related",
                "href": `../../projects/${project}/collection.json`,
                "type": "application/json",
                "title": `Project: ${project}`
            },
            {
                "rel": "application",
                "type": "application/json",
                "title": "openEO Workflow",
                "href": workflowUrl,
            },
        ],
        properties: {
            title,
            description,
            created: moment().toISOString(false),
            updated: moment().toISOString(false),
            type: "workflow",
            "osc:missions": [],
            "osc:project": project,
            "osc:status": "completed",
            "osc:type": "workflow",
            "osc:variables": [],
            "osc:region": "",
        }
    }
}

export const createExperimentCollection = (id: string, title: string, description: string, license: string, workflowId: string, productId: string): EarthCODEExpiriment => {
    return {
        id,
        type: "Feature",
        conformsTo: [
            "http://www.opengis.net/spec/ogcapi-records-1/1.0/req/record-core"
        ],
        geometry: null,
        properties: {
            created: moment().toISOString(false),
            updated: moment().toISOString(false),
            type: "experiment",
            title,
            description,
            license,
            "osc:workflow": workflowId,
            "osc:product":  productId,
            version: "2"
        },
        links: [
            {
                rel: "root",
                href: "../../catalog.json",
                type: "application/json",
                title: "Open Science Catalog"
            },
            {
                rel: "parent",
                href: "../catalog.json",
                type: "application/json",
                title: "Experiments"
            },
            {
                rel: "related",
                href: `../../workflows/${workflowId}/record.json`,
                type: "application/json",
                title: `Workflow: ${workflowId}`
            },
            {
                rel: "related",
                href: `../../products/${productId}/collection.json`,
                type: "application/json",
                title: `Product: ${productId}`
            }
        ]
    }
}
