import {Autocomplete, FormControl, MenuItem, Select, TextField} from "@mui/material";
import React from "react";
import {WorkflowInfo} from "../../../lib/earthcode/schema.model";
import {EarthCODEProjectInfo, EarthCODEThemeInfo, EarthCODEWorfklowInfo} from "../../../lib/earthcode/concepts.models";

interface WorkflowFormProps {
    schema: WorkflowInfo;
    projects: EarthCODEProjectInfo[];
    themes: EarthCODEThemeInfo[];
    workflows: EarthCODEWorfklowInfo[];
    onFormChange: (schema: WorkflowInfo, key: string, value: any) => void;
    isChild?: boolean;
}

export const WorkflowForm = ({
                                 schema,
                                 projects,
                                 themes,
                                 workflows,
                                 onFormChange,
                                 isChild = false
                             }: WorkflowFormProps) => {

    const generateExistingWorfklowForm = () => (
        <>
            <Autocomplete
                options={workflows}
                value={workflows.find(w => w.id === schema.id) || null}
                onChange={(event, value) => onFormChange(schema, "id", (value as EarthCODEWorfklowInfo)?.id)}
                getOptionLabel={(option) => option.title}
                getOptionKey={(option) => option.id}
                renderInput={(params) => <TextField {...params}
                                                    required
                                                    error={!schema.id}
                                                    placeholder="Name of the workflow"
                                                    data-testid="workflow-schema-workflow" variant="outlined"
                                                    label="Workflow"/>}
            />
        </>
    )

    const generateNewWorkflowForm = () => (<>
            {!isChild &&
                <Autocomplete
                    options={projects}
                    value={schema.project || null}
                    onChange={(event, value) => onFormChange(schema, "project", value)}
                    getOptionLabel={(option) => option.title}
                    getOptionKey={(option) => option.id}
                    renderInput={(params) => <TextField {...params}
                                                        required
                                                        error={!schema.project}
                                                        onChange={(e) => onFormChange(schema, "project", e.target.value)}
                                                        placeholder="Name of the project used to generate the workflow"
                                                        data-testid="workflow-schema-project" variant="outlined"
                                                        label="Project"/>}
                />
            }
            <TextField
                label="ID"
                variant="outlined"
                value={schema.id}
                onChange={(e) => onFormChange(schema, "id", e.target.value)}
                placeholder="Unique identifier for the workflow"
                data-testid="workflow-schema-id"
                required
                error={!schema.id}
            />
            <TextField
                label="URL"
                variant="outlined"
                value={schema.url}
                onChange={(e) => onFormChange(schema, "url", e.target.value)}
                placeholder="Public URL pointing to the openEO user defined process"
                data-testid="workflow-schema-url"
                required
                error={!schema.url}
                type='url'
            />
            <TextField
                label="Title"
                variant="outlined"
                value={schema.title}
                onChange={(e) => onFormChange(schema, "title", e.target.value)}
                placeholder="Title of the workflow"
                data-testid="workflow-schema-title"
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
                placeholder="Short description of the workflow"
                data-testid="workflow-schema-description"
                required
                error={!schema.description}
            />
            {!isChild &&
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
                                                        placeholder="Themes that are applicable for the workflow"
                                                        data-testid="workflow-schema-theme" variant="outlined"
                                                        label="Themes"/>}
                />

            }
        </>
    )


    return (
        <div className='p-10'>
        <span className='font-bold mb-5 text-xl flex items-center'>
                            Workflow
                        </span>
            <FormControl className='flex w-full flex-col gap-4'>
                {isChild &&
                    <Select
                        data-testid="workflow-schema-mode"
                        value={schema.isExisting ? 1 : 2}
                        onChange={(event, value) => {
                            onFormChange(schema, "isExisting", event.target.value === 1);
                        }}
                    >
                        <MenuItem value={1}>Select existing workflow</MenuItem>
                        <MenuItem value={2}>Create new workflow</MenuItem>
                    </Select>
                }
                {!schema.isExisting ? generateNewWorkflowForm() : generateExistingWorfklowForm()}
            </FormControl>
        </div>
    );
};
