import {Autocomplete, FormControl, TextField} from "@mui/material";
import React from "react";
import {ProductInfo} from "../../../lib/earthcode/schema.model";

interface ProductFormProps {
    schema: ProductInfo;
    projects: string[];
    onFormChange: (schema: ProductInfo, key: "id" | "project" | "title" | "description", value: string) => void;
    showProjects?: boolean;
}

export const ProductForm = ({schema, projects, onFormChange, showProjects = true}: ProductFormProps) => {
    return (
        <div>
        <span className='font-bold mb-4 flex items-center'>
                            Product
                        </span>
            <FormControl className='flex w-full flex-col gap-4'>
                {showProjects &&
                    <Autocomplete
                        options={projects}
                        value={schema.project}
                        onChange={(event, value) => onFormChange(schema, "project", value || '')}
                        renderInput={(params) => <TextField {...params}
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
    );
};
