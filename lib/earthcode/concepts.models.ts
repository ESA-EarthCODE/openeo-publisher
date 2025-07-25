import { Extent, Link } from "../openeo/results.models";

export interface OSCProps {
    "osc:type"?: string;
    "osc:status"?: string;
    "osc:project"?: string;
    "osc:variables"?: any[];
    "osc:missions"?: any[];
    "osc:region"?: string;
}

export interface OSCExperimentProps extends OSCProps {
    "osc:workflow": string;
    "osc:product": string;
}

export interface RecordProperties {
    title: string;
    description: string;
    type: string;
    created: string;
    updated: string;
    license?: string;
    version?: string;
    themes: any[];
}

export interface RecordHeaders {
    type: "Feature";
    conformsTo: string[];
    id: string;
    geometry: any;
    links: Link[];
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
    themes: any[];
}

export interface EarthCODEWorkflow extends RecordHeaders {
    properties: RecordProperties & OSCProps;

}
export interface EarthCODEExperiment extends RecordHeaders {
    properties: RecordProperties & OSCExperimentProps;
}

export interface EarthCODEProjectInfo {
    id: string;
    title: string;
}

export interface EarthCODEThemeInfo {
    id: string;
    title: string;
}

export interface EarthCODEWorfklowInfo {
    id: string;
    title: string;
}
