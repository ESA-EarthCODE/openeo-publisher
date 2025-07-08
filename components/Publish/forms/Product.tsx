import { Autocomplete, Avatar, Button, FormControl, IconButton, List, ListItem, ListItemAvatar, ListItemText, TextField } from "@mui/material";
import FilePresentIcon from '@mui/icons-material/FilePresent';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import React, { useCallback, useState } from "react";
import { ProductAsset, ProductInfo } from "../../../lib/earthcode/schema.model";
import { EarthCODEProjectInfo, EarthCODEThemeInfo } from "../../../lib/earthcode/concepts.models";

interface ProductFormProps {
    schema: ProductInfo;
    projects: EarthCODEProjectInfo[];
    themes: EarthCODEThemeInfo[];
    onFormChange: (schema: ProductInfo, key: string, value: any) => void;
    isChild?: boolean;
}

export const ProductForm = ({ schema, projects, themes, onFormChange, isChild = false }: ProductFormProps) => {

    const [newAssetName, setNewAssetName] = useState<string>('');
    const [newAssetUrl, setNewAssetUrl] = useState<string>('');

    const deleteAsset = useCallback((asset: ProductAsset) => {
        const assets = schema.assets.filter(u => u.url !== asset.url);
        onFormChange(schema, "assets", assets);
    }, [schema, onFormChange]);

    const addAsset = useCallback(() => {
        if (newAssetName !== '' && newAssetUrl !== '') {
            const assets = [...schema.assets, {
                name: newAssetName,
                url: newAssetUrl
            }]
            onFormChange(schema, "assets", assets);
            setNewAssetName('');
            setNewAssetUrl('');
        }
    }, [newAssetName, newAssetUrl, schema, onFormChange]);


    const handleKeyDown = useCallback((e: any) => {
        if (e.key === 'Enter' && newAssetName !== '' && newAssetUrl !== '') {
            e.preventDefault();
            addAsset();
        }
    }, [newAssetName, newAssetUrl]);

    return (
        <div className='p-10'>
            <span className='font-bold mb-5 text-xl  flex items-center'>
                Product(s)
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
                            label="Project" />}
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
                            label="Themes" />}
                    />
                }
                <h2>Assets ({schema.assets.length})</h2>
                {schema.assets.length > 0 ?
                    <List>
                        {
                            schema.assets.map((u, idx) => (<ListItem data-testid="product-schema-asset" key={`product-asset-${idx}`}
                                secondaryAction={
                                    <IconButton data-testid="product-schema-asset-delete" edge="end" aria-label="delete" onClick={() => deleteAsset(u)}>
                                        <DeleteIcon />
                                    </IconButton>
                                }
                            >
                                <ListItemAvatar>
                                    <Avatar>
                                        <FilePresentIcon />
                                    </Avatar>
                                </ListItemAvatar>
                                <ListItemText
                                    primary={u.name}
                                    secondary={<span className="break-all">{u.url}</span>}
                                    className="flex flex-col"
                                />
                            </ListItem>))
                        }
                    </List> : <span className="text-sm text-gray-500">No assets defined for the product. Specify at least one asset.</span>
                }
                <div className="flex flex-col gap-2">
                    <div className="flex gap-2">
                        <TextField
                            label="Name"
                            variant="outlined"
                            value={newAssetName}
                            onChange={(e) => setNewAssetName(e.target.value)}
                            type="text"
                            placeholder="Name"
                            data-testid="product-schema-add-asset-name"
                            onKeyDown={handleKeyDown}
                        />
                        <TextField
                            label="URL"
                            variant="outlined"
                            value={newAssetUrl}
                            onChange={(e) => setNewAssetUrl(e.target.value)}
                            type="url"
                            placeholder="URL"
                            className="flex-1"
                            data-testid="product-schema-add-asset-url"
                            onKeyDown={handleKeyDown}
                        />
                        <Button data-testid="product-schema-add-asset-button" disabled={newAssetName === '' || newAssetUrl === ''} onClick={addAsset} variant="contained" startIcon={<AddIcon />}>Add Asset</Button>
                    </div>
                </div>
            </FormControl>
        </div>
    );
};
