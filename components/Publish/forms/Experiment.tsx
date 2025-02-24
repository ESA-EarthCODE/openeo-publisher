import {Autocomplete, FormControl, TextField} from "@mui/material";
import React, {useCallback} from "react";
import {ExperimentInfo, ProductInfo, WorkflowInfo} from "../../../lib/earthcode/schema.model";
import {ProductForm} from "@/components/Publish/forms/Product";
import {WorkflowForm} from "@/components/Publish/forms/Workflow";

interface ExperimentFormProps {
    schema: ExperimentInfo;
    projects: string[];
    onFormChange: (schema: ExperimentInfo, key: "id" | "project" | "title" | "description" | "product" | "workflow", value: any) => void;
}

export const ExperimentForm = ({schema, projects, onFormChange}: ExperimentFormProps) => {

    const handleProductChange = useCallback((product: ProductInfo, key: any, value: string) => {
        onFormChange(schema, "product", {
            ...product,
            [key]: value
        });
    }, []);

    const handleWorkflowChange = useCallback((workflow: WorkflowInfo, key: any, value: string) => {
        onFormChange(schema, "workflow", {
            ...workflow,
            [key]: value
        });
    }, []);


    return (
        <div className='flex flex-col gap-5'>
            <div>
                <span className='font-bold mb-4 flex items-center'>
                            Experiment
                        </span>
                <FormControl className='flex w-full flex-col gap-4'>
                    <Autocomplete
                        options={projects}
                        value={schema.project}
                        onChange={(event, value) => onFormChange(schema, "project", value || '')}
                        renderInput={(params) => <TextField {...params}
                                                            onChange={(e) => onFormChange(schema, "project", e.target.value)}
                                                            data-testid="schema-project" variant="outlined"
                                                            label="Project"/>}
                    />
                    <TextField
                        label="ID"
                        variant="outlined"
                        value={schema.id}
                        onChange={(e) => onFormChange(schema, "id", e.target.value)}
                        data-testid="schema-id"
                    />
                    <TextField
                        label="Title"
                        variant="outlined"
                        value={schema.title}
                        onChange={(e) => onFormChange(schema, "title", e.target.value)}
                        data-testid="schema-title"
                    />
                    <TextField
                        label="Description"
                        variant="outlined"
                        multiline
                        rows={5}
                        value={schema.description}
                        onChange={(e) => onFormChange(schema, "description", e.target.value)}
                        data-testid="schema-description"
                    />
                </FormControl>
            </div>
            <hr/>
            <div>
                <WorkflowForm schema={schema.workflow} projects={[]} onFormChange={handleWorkflowChange}
                              showProjects={false}/>
            </div>
            <hr/>
            <div>
                <ProductForm schema={schema.product} projects={[]} onFormChange={handleProductChange}
                             showProjects={false}/>
            </div>
        </div>
    );
};
