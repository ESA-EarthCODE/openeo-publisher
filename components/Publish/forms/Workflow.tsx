import {Autocomplete, FormControl, TextField} from "@mui/material";
import React from "react";
import {JobSchemaInfo, ProductInfo, WorkflowInfo} from "../../../lib/earthcode/schema.model";

interface WorkflowFormProps {
    schema: WorkflowInfo;
    projects: string[];
    onFormChange: (schema: WorkflowInfo, key: "id" | "project" | "title" | "description" | "url", value: string) => void;
    showProjects?: boolean;
}

export const WorkflowForm = ({schema, projects, onFormChange, showProjects = true}: WorkflowFormProps) => {
    return (
        <div>
        <span className='font-bold mb-4 flex items-center'>
                            Workflow
                        </span>
            <FormControl className='flex w-full flex-col gap-4'>
                {showProjects &&
                    <Autocomplete
                        options={projects}
                        value={schema.project}
                        onChange={(event, value) => onFormChange(schema, "project", value || '')}
                        renderInput={(params) => <TextField {...params}
                                                            required
                                                            error={!schema.project}
                                                            onChange={(e) => onFormChange(schema, "project", e.target.value)}
                                                            data-testid="schema-project" variant="outlined"
                                                            label="Project"/>}
                    />
                }
                <TextField
                    label="ID"
                    variant="outlined"
                    value={schema.id}
                    onChange={(e) => onFormChange(schema, "id", e.target.value)}
                    data-testid="schema-id"
                    required
                    error={!schema.id}
                />
                <TextField
                    label="URL"
                    variant="outlined"
                    value={schema.url}
                    onChange={(e) => onFormChange(schema, "url", e.target.value)}
                    data-testid="schema-url"
                    required
                    error={!schema.url}
                />
                <TextField
                    label="Title"
                    variant="outlined"
                    value={schema.title}
                    onChange={(e) => onFormChange(schema, "title", e.target.value)}
                    data-testid="schema-title"
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
                    data-testid="schema-description"
                    required
                    error={!schema.description}
                />
            </FormControl>
        </div>
    );
};
