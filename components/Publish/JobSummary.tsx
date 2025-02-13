import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import {SchemaType} from "../../lib/earthcode/schema.model";
import {OpenEOJob} from "../../lib/openeo/jobs.models";

interface JobSummaryProps {
    job: OpenEOJob;
    selectedSchemas: SchemaType[];
    onSchemaChange: (job: OpenEOJob, value: SchemaType[]) => void;
}

export const JobSummary = ({ job, selectedSchemas, onSchemaChange }: JobSummaryProps) => {
    return (
        <div className="flex items-center justify-between w-full bg-neutral-100 rounded-t-lg px-4 py-4">
            <span>{job.title}</span>
            <FormControl>
                <InputLabel id={`select-as-${job.id}-label`}>Publish as</InputLabel>
                <Select
                    labelId={`select-as-${job.id}-label`}
                    label="Index as"
                    multiple
                    value={selectedSchemas}
                    onChange={(e) => onSchemaChange(job, e.target.value as SchemaType[])}
                    className="min-w-64"
                >
                    {Object.values(SchemaType).map((type) => (
                        <MenuItem key={type} value={type}>
                            {type}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </div>
    );
};
