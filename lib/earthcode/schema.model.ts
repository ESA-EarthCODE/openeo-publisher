import { OpenEOJob } from "../openeo/jobs.models";
import { EarthCODEProjectInfo, EarthCODEThemeInfo } from "./concepts.models";

export enum SchemaType {
    PRODUCT = 'Product',
    WORKFLOW = 'Workflow',
    EXPERIMENT = 'Experiment',
}

export interface JobSchemaInfo {
    type: SchemaType;
    id: string;
    title: string;
    description: string;
    project?: EarthCODEProjectInfo;
    job: OpenEOJob;
    href?: string;
    themes: EarthCODEThemeInfo[];
}
export interface ProductAsset {
    name: string;
    url: string;
}

export interface ProductInfo extends JobSchemaInfo {
    assets: ProductAsset[];
}

export interface WorkflowInfo extends JobSchemaInfo {
    url: string;
    isExisting: boolean;
}

export interface ExperimentInfo extends JobSchemaInfo {
    url: string;
    isExisting: boolean;
    license: string;
    product: ProductInfo;
    workflow: WorkflowInfo;
}

