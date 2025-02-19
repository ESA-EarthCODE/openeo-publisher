import {Assets, Extent, Link} from "../openeo/results.models";

export interface OSCProps {
    "osc:type"?: string
    "osc:status"?: string
    "osc:project"?: string
    "osc:variables"?: any[]
    "osc:missions"?: any[];
    "osc:region"?: string;
}

export interface EarthCODEProduct extends OSCProps {
    type: string
    id: string
    stac_version: string
    description: string
    title: string
    license: string
    stac_extensions: string[]
    extent: Extent
    links: Link[]
    assets: Assets
}

export interface EarthCODEWorkflow {
    type: "Feature";
    conformsTo: string[];
    id: string;
    geometry: any;
    links: Link[];
    properties: {
        title: string;
        description: string;
        type: string;
    } & OSCProps;
}
