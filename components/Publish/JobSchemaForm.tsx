import {ExperimentInfo, JobSchemaInfo, ProductInfo, SchemaType, WorkflowInfo} from "../../lib/earthcode/schema.model";
import React from "react";
import {ProductForm} from "@/components/Publish/forms/Product";
import {ExperimentForm} from "@/components/Publish/forms/Experiment";
import {WorkflowForm} from "@/components/Publish/forms/Workflow";
import {EarthCODEProjectInfo} from "../../lib/earthcode/concepts.models";

interface JobSchemaFormProps {
    schema: JobSchemaInfo;
    projects: EarthCODEProjectInfo[];
    onFormChange: (schema: JobSchemaInfo, key: any, value: any) => void;
}

export const JobSchemaForm = ({schema, projects, onFormChange}: JobSchemaFormProps) => {
    return (
        <div key={`job_form_${schema.job.id}_${schema.type}`}
             className='flex w-full flex-col gap-2'>
            {
                schema.type === SchemaType.PRODUCT && (
                    <ProductForm schema={schema as ProductInfo} projects={projects} onFormChange={onFormChange}/>
                )
            }
            {
                schema.type === SchemaType.WORKFLOW && (
                    <WorkflowForm schema={schema as WorkflowInfo} projects={projects} onFormChange={onFormChange}/>
                )
            }
            {
                schema.type === SchemaType.EXPERIMENT && (
                    <ExperimentForm schema={schema as ExperimentInfo} projects={projects} onFormChange={onFormChange}/>
                )
            }
        </div>
    );
};
