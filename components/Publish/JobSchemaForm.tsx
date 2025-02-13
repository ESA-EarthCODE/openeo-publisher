import {Autocomplete, CircularProgress, FormControl, TextField} from "@mui/material";
import {JobSchemaInfo} from "../../lib/earthcode/schema.model";
import {SchemaType} from "../../lib/earthcode/schema.model";
import React from "react";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import AccessTimeFilledIcon from "@mui/icons-material/AccessTimeFilled";

interface JobSchemaFormProps {
    schema: JobSchemaInfo;
    projects: string[];
    onFormChange: (schema: JobSchemaInfo, key: "id" | "project", value: string) => void;
}

export const JobSchemaForm = ({schema, projects, onFormChange}: JobSchemaFormProps) => {
    return (
        <div key={`job_form_${schema.job.id}_${schema.type}`}
             className='flex w-full flex-col gap-2'>
            {
                schema.type === SchemaType.PRODUCT && (
                    <>
                        <span className='font-bold mb-4 flex items-center'>
                            Product
                        </span>
                        <FormControl className='flex w-full flex-col gap-4'>
                            <TextField
                                label="ID"
                                variant="outlined"
                                value={schema.id}
                                onChange={(e) => onFormChange(schema, "id", e.target.value)}
                            />
                            <Autocomplete
                                options={projects}
                                value={schema.project}
                                onChange={(event, value) => onFormChange(schema, "project", value || '')}
                                renderInput={(params) => <TextField {...params} onChange={(e) => onFormChange(schema, "project", e.target.value)} variant="outlined" label="Project"/>}
                            />
                        </FormControl>
                    </>
                )}
        </div>
    );
};
