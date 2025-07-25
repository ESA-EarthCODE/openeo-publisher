import { ProductForm } from "@/components/Publish/forms/Product";
import { WorkflowForm } from "@/components/Publish/forms/Workflow";
import { Autocomplete, FormControl, MenuItem, Select, TextField } from "@mui/material";
import { useCallback } from "react";
import {
  EarthCODEProjectInfo,
  EarthCODEThemeInfo,
  EarthCODEWorfklowInfo,
} from "../../../lib/earthcode/concepts.models";
import {
  ExperimentInfo,
  ProductInfo,
  WorkflowInfo,
} from "../../../lib/earthcode/schema.model";

interface ExperimentFormProps {
  schema: ExperimentInfo;
  projects: EarthCODEProjectInfo[];
  themes: EarthCODEThemeInfo[];
  workflows: EarthCODEWorfklowInfo[];
  onFormChange: (schema: ExperimentInfo, key: string, value: any) => void;
}

export enum ExperimentDefinitionMode {
  OPENEO,
  URL
}

export const ExperimentForm = ({
  schema,
  projects,
  themes,
  workflows,
  onFormChange,
}: ExperimentFormProps) => {

  const handleProductChange = useCallback(
    (product: ProductInfo, key: any, value: any) => {
      onFormChange(schema, "product", {
        ...product,
        [key]: value,
      });
    },
    []
  );

  const handleWorkflowChange = useCallback(
    (workflow: WorkflowInfo, key: any, value: any) => {
      onFormChange(schema, "workflow", {
        ...workflow,
        id: key === "isExisting" && value === true ? "" : workflow.id,
        [key]: value,
      });
    },
    []
  );

  return (
    <div className="flex flex-col">
      <div className="p-10">
        <span className="font-bold mb-5 text-xl flex items-center">
          Experiment
        </span>
        <FormControl className="flex w-full flex-col gap-4">
          <Autocomplete
            options={projects}
            value={schema.project || null}
            onChange={(event, value) => onFormChange(schema, "project", value)}
            getOptionLabel={(option) => option.title}
            getOptionKey={(option) => option.id}
            renderInput={(params) => (
              <TextField
                {...params}
                required
                error={!schema.project}
                placeholder="Name of the project used to generate the experiment"
                data-testid="experiment-schema-project"
                variant="outlined"
                label="Project"
              />
            )}
          />
          <TextField
            label="ID"
            variant="outlined"
            value={schema.id}
            onChange={(e) => onFormChange(schema, "id", e.target.value)}
            data-testid="experiment-schema-id"
            placeholder="Unique identifier for the experiment"
            required
            error={!schema.id}
          />
          <TextField
            label="Title"
            variant="outlined"
            value={schema.title}
            onChange={(e) => onFormChange(schema, "title", e.target.value)}
            placeholder="Title of the experiment"
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
            onChange={(e) =>
              onFormChange(schema, "description", e.target.value)
            }
            placeholder="Short description of the experiment"
            data-testid="experiment-schema-description"
            required
            error={!schema.description}
          />
          <TextField
            label="License"
            variant="outlined"
            value={schema.license}
            onChange={(e) => onFormChange(schema, "license", e.target.value)}
            placeholder="Applicable license for the experiment"
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
            renderInput={(params) => (
              <TextField
                {...params}
                required
                error={schema.themes.length === 0}
                placeholder="Themes that are applicable for the experiment"
                data-testid="experiment-schema-theme"
                variant="outlined"
                label="Themes"
              />
            )}
          />
          <Select
            data-testid="experiment-definition-mode"
            value={schema.isExisting ? 1 : 2}
            onChange={(event, value) => {
              onFormChange(schema, "isExisting", event.target.value === 1);
            }}
          >
            <MenuItem value={2}>Use job process graph</MenuItem>
            <MenuItem value={1}>Set URL to openEO process graph</MenuItem>
          </Select>
          {
            schema.isExisting && (
              <TextField
                label="Experiment URL"
                variant="outlined"
                value={schema.url || ''}
                type="url"
                required
                onChange={(e) => onFormChange(schema, "url", e.target.value)}
                placeholder="Public URL containing the experiment defintion"
                data-testid="experiment-schema-url"
                error={schema.url === ''}
              />

            )
          }
        </FormControl>
      </div>
      <div className="bg-neutral-50">
        <WorkflowForm
          schema={schema.workflow}
          themes={themes}
          projects={[]}
          workflows={workflows}
          onFormChange={handleWorkflowChange}
          isChild={true}
        />
      </div>
      <div>
        <ProductForm
          schema={schema.product}
          themes={themes}
          projects={[]}
          onFormChange={handleProductChange}
          isChild={true}
        />
      </div>
    </div>
  );
};
