import {CircularProgress, FormControl, TextField} from "@mui/material";
import {JobSchemaInfo} from "../../lib/earthcode/schema.model";
import {SchemaType} from "../../lib/earthcode/schema.model";
import React from "react";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import AccessTimeFilledIcon from "@mui/icons-material/AccessTimeFilled";

interface JobSchemaFormProps {
    schema: JobSchemaInfo;
    status: 'none' | 'processing' | 'done';
    onFormChange: (schema: JobSchemaInfo, key: "id" | "project", value: string) => void;
}

export const JobSchemaForm = ({schema, status, onFormChange}: JobSchemaFormProps) => {
    const generateStatusIcon = () => {
        if (status === 'processing') return <CircularProgress size={21}/>;
        if (status === 'done') return <CheckCircleIcon color="success"/>;
        return <AccessTimeFilledIcon color="disabled"/>;
    };

    return (
        <div key={`job_form_${schema.job.id}_${schema.type}`}
             className='flex w-full flex-col gap-2'>
            {
                schema.type === SchemaType.PRODUCT && (
                    <>
                        <span className='font-bold mb-4 flex items-center'>
                            <div className='mr-2'>
                                {generateStatusIcon()}
                            </div>
                            Product
                        </span>
                        <FormControl className='flex w-full flex-col gap-4'>
                            <TextField
                                label="ID"
                                variant="outlined"
                                value={schema.id}
                                onChange={(e) => onFormChange(schema, "id", e.target.value)}
                            />
                            <TextField
                                label="Project"
                                variant="outlined"
                                value={schema.project}
                                onChange={(e) => onFormChange(schema, "project", e.target.value)}
                            />
                        </FormControl>
                    </>
                )}
        </div>
    );
};
