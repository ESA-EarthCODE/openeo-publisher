'use client';

import {OpenEOBackend} from "../lib/openeo/models";
import {useOpenEOStore} from "../store/openeo";
import {Chip, CircularProgress, Typography} from "@mui/material";
import {useOpenEOJobs} from "../hooks/useOpenEOJobs";

export const JobListing = () => {

    const selected: OpenEOBackend | undefined = useOpenEOStore((state) => state.selectedBackend);
    const {data, error, loading} = useOpenEOJobs(selected);


    return selected &&
        <div>
            <div className='flex items-center'>
                <Typography variant='h4'>{selected.title}</Typography>
                <div className='ml-2'><Chip label={selected.version} color="primary"/></div>
            </div>
            <div className='mt-2 text-neutral-500'>{selected.description}</div>
            {
                loading && <CircularProgress color="inherit"/>
            }
            {
                !loading &&
                <div className='mt-7'>
                    <Typography variant='h5'>Jobs ({data.length})</Typography>
                </div>
            }
        </div>
}