import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import {SchemaType} from "../../lib/earthcode/schema.model";
import {OpenEOJob} from "../../lib/openeo/jobs.models";

interface JobSummaryProps {
    job: OpenEOJob;
    selectedSchema: SchemaType;
    onSchemaChange: (job: OpenEOJob, value: SchemaType) => void;
}

export const JobSummary = ({ job, selectedSchema, onSchemaChange }: JobSummaryProps) => {
    return (
        <div className="flex items-center justify-between w-full bg-primary text-white px-4 py-4">
            <span className='font-bold text-sm'>{job.title}</span>
            <FormControl>
                <InputLabel id={`select-as-${job.id}-label`} sx={{ color: 'white', '&.Mui-focused': { color: 'white'}}}>Publish as</InputLabel>
                <Select
                    labelId={`select-as-${job.id}-label`}
                    label="Index as"
                    value={selectedSchema || ""}
                    onChange={(e) => onSchemaChange(job, e.target.value as SchemaType)}
                    className="min-w-64"
                    sx={{
                        color: 'white',
                        backgroundColor: 'transparent', // Ensure background remains clear
                        borderColor: 'white',
                        '.MuiOutlinedInput-notchedOutline': { borderColor: 'white' }, // Ensures white border
                        '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'white' },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: 'white' },
                        '.MuiSvgIcon-root': { color: 'white' }, // Ensures dropdown arrow is white
                    }}
                    size='small'
                    data-testid='jobschema-selector'
                >
                    {Object.values(SchemaType).map((type) => (
                        <MenuItem key={type} value={type}
                                  data-testid='jobschema-selector-item'
                        >
                            {type}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </div>
    );
};
