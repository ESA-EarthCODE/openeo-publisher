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
        <div className='p-10'>
        <span className='font-bold mb-5 text-xl  flex items-center'>
                            Product
                        </span>
            <FormControl className='flex w-full flex-col gap-4'>
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
                                                            placeholder="Name of the project used to generate the product"
                                                            data-testid="product-schema-project" variant="outlined"
                                                            label="Project"/>}
                    />
                }
                <TextField
                    label="ID"
                    variant="outlined"
                    value={schema.id}
                    onChange={(e) => onFormChange(schema, "id", e.target.value)}
                    placeholder="Unique identifier for the product"
                    data-testid="product-schema-id"
                    required
                    error={!schema.id}
                />
                <TextField
                    label="Title"
                    variant="outlined"
                    value={schema.title}
                    onChange={(e) => onFormChange(schema, "title", e.target.value)}
                    placeholder="Title of the product"
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
                    placeholder="Short description of the product"
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
                                                            placeholder="Themes that are applicable for the product"
                                                            data-testid="product-schema-theme" variant="outlined"
                                                            label="Themes"/>}
                    />
                }
            </FormControl>
        </div>
    );
};
