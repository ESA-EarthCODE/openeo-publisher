import {Autocomplete, FormControl, TextField} from "@mui/material";
import React, {useCallback} from "react";
import {ExperimentInfo, ProductInfo, WorkflowInfo} from "../../../lib/earthcode/schema.model";
import {ProductForm} from "@/components/Publish/forms/Product";
import {WorkflowForm} from "@/components/Publish/forms/Workflow";
import {EarthCODEProjectInfo, EarthCODEThemeInfo} from "../../../lib/earthcode/concepts.models";

interface ExperimentFormProps {
    schema: ExperimentInfo;
    projects: EarthCODEProjectInfo[];
    themes: EarthCODEThemeInfo[];
    onFormChange: (schema: ExperimentInfo, key: string, value: any) => void;
}

export const ExperimentForm = ({schema, projects, themes, onFormChange}: ExperimentFormProps) => {

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
                        onChange={(event, value) => onFormChange(schema, "project", value)}
                        getOptionLabel={(option) => option.title}
                        getOptionKey={(option) => option.id}
                        renderInput={(params) => <TextField {...params}
                                                            required
                                                            error={!schema.project}
                                                            onChange={(e) => onFormChange(schema, "project", e.target.value)}
                                                            data-testid="experiment-schema-project" variant="outlined"
                                                            label="Project"/>}
                    />
                    <TextField
                        label="ID"
                        variant="outlined"
                        value={schema.id}
                        onChange={(e) => onFormChange(schema, "id", e.target.value)}
                        data-testid="experiment-schema-id"
                        required
                        error={!schema.id}
                    />
                    <TextField
                        label="Title"
                        variant="outlined"
                        value={schema.title}
                        onChange={(e) => onFormChange(schema, "title", e.target.value)}
                        data-testid="experiment-schema-title"
                        required
                        error={!schema.title}
                    />
                    <TextField
                        label="Description"
                        variant="outlined"
                        multiline
                        rows={5}
                        value={schema.description}
                        onChange={(e) => onFormChange(schema, "description", e.target.value)}
                        data-testid="experiment-schema-description"
                        required
                        error={!schema.description}
                    />
                    <TextField
                        label="License"
                        variant="outlined"
                        value={schema.license}
                        onChange={(e) => onFormChange(schema, "license", e.target.value)}
                        data-testid="experiment-schema-license"
                    />
                    <Autocomplete
                        options={themes}
                        value={schema.themes || []}
                        onChange={(event, value) => onFormChange(schema, "themes", value)}
                        getOptionLabel={(option) => option.title}
                        getOptionKey={(option) => option.id}
                        isOptionEqualToValue={(option, value) => option.id === value.id}
                        multiple
                        renderInput={(params) => <TextField {...params}
                                                            required
                                                            error={schema.themes.length === 0}
                                                            data-testid="expriment-schema-theme" variant="outlined"
                                                            label="Themes"/>}
                    />
                </FormControl>
            </div>
            <hr/>
            <div>
                <WorkflowForm schema={schema.workflow} themes={themes} projects={[]} onFormChange={handleWorkflowChange}
                              isChild={true}/>
            </div>
            <hr/>
            <div>
                <ProductForm schema={schema.product} themes={themes} projects={[]} onFormChange={handleProductChange}
                             isChild={true}/>
            </div>
        </div>
    );
};
