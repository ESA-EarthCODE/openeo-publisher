import {Autocomplete, FormControl, TextField} from "@mui/material";
import React from "react";
import {ProductInfo} from "../../../lib/earthcode/schema.model";
import {EarthCODEProjectInfo, EarthCODEThemeInfo} from "../../../lib/earthcode/concepts.models";

interface ProductFormProps {
    schema: ProductInfo;
    projects: EarthCODEProjectInfo[];
    themes: EarthCODEThemeInfo[];
    onFormChange: (schema: ProductInfo, key: string, value: any) => void;
    isChild?: boolean;
}

export const ProductForm = ({schema, projects, themes, onFormChange, isChild = false}: ProductFormProps) => {
    return (
        <div>
        <span className='font-bold mb-4 flex items-center'>
                            Product
                        </span>
            <FormControl className='flex w-full flex-col gap-4'>
                {!isChild &&
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
                                                            data-testid="product-schema-project" variant="outlined"
                                                            label="Project"/>}
                    />
                }
                <TextField
                    label="ID"
                    variant="outlined"
                    value={schema.id}
                    onChange={(e) => onFormChange(schema, "id", e.target.value)}
                    data-testid="product-schema-id"
                    required
                    error={!schema.id}
                />
                <TextField
                    label="Title"
                    variant="outlined"
                    value={schema.title}
                    onChange={(e) => onFormChange(schema, "title", e.target.value)}
                    data-testid="product-schema-title"
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
                    data-testid="product-schema-description"
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
                                                            data-testid="product-schema-theme" variant="outlined"
                                                            label="Themes"/>}
                    />
                }
            </FormControl>
        </div>
    );
};
