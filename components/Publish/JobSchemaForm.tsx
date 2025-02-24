import {JobSchemaInfo, SchemaType} from "../../lib/earthcode/schema.model";
import React from "react";
import {ProductForm} from "@/components/Publish/forms/Product";
import {ExperimentForm} from "@/components/Publish/forms/Experiment";

interface JobSchemaFormProps {
    schema: JobSchemaInfo;
    projects: string[];
    onFormChange: (schema: JobSchemaInfo, key: "id" | "project" | "title" | "description", value: string) => void;
}

export const JobSchemaForm = ({schema, projects, onFormChange}: JobSchemaFormProps) => {
    return (
        <div key={`job_form_${schema.job.id}_${schema.type}`}
             className='flex w-full flex-col gap-2'>
            {
                schema.type === SchemaType.PRODUCT && (
                    <ProductForm schema={schema} projects={projects} onFormChange={onFormChange}/>
                )
            }
            {
                schema.type === SchemaType.EXPERIMENT && (
                    <ExperimentForm schema={schema} projects={projects} onFormChange={onFormChange}/>
                )
            }
        </div>
    );
};
