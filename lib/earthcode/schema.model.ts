import {OpenEOJob} from "../openeo/jobs.models";

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
    project: string;
    job: OpenEOJob;
}

export interface ProductInfo extends JobSchemaInfo {
}

export interface WorkflowInfo extends JobSchemaInfo {
    url: string;
}

export interface ExperimentInfo extends JobSchemaInfo {
    product: ProductInfo;
    workflow: WorkflowInfo;
}
