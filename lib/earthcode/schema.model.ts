import {OpenEOJob} from "../openeo/jobs.models";

export enum SchemaType {
    PRODUCT = 'Product'
}

export interface JobSchemaInfo {
    id: string;
    project: string;
    type: SchemaType;
    job: OpenEOJob;
}
