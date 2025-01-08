'use client';

import {OpenEOBackend, OpenEOJob} from "../lib/openeo/models";
import {useOpenEOStore} from "../store/openeo";
import {Button, Chip, Typography} from "@mui/material";
import {useOpenEOJobs} from "../hooks/useOpenEOJobs";
import {ResponseError} from "../lib/utils/ResponseError";
import {Authenticate} from "@/components/Authenticate";
import {Loading} from "@/components/Loading";
import {JobTable} from "@/components/JobTable";
import {useEffect, useState} from "react";
import {PublishModal} from "@/components/PublisModal";

export const JobListing = () => {

    const [selectedJobs, setSelectedJobs] = useState<OpenEOJob[]>([]);
    const [modalOpen, setModalOpen] = useState<boolean>(false);
    const selected: OpenEOBackend | undefined = useOpenEOStore((state) => state.selectedBackend);
    const {data, error, loading} = useOpenEOJobs(selected);

    return selected &&
        <div>
            <div className='flex items-center'>
                <Typography variant='h4'>{selected.title}</Typography>
                <div className='ml-2'><Chip label={selected.version} color="primary"/></div>
            </div>
            <div className='mt-2 mb-5 text-neutral-500'>{selected.description}</div>
            {
                loading && <Loading></Loading>
            }
            {
                error && [401, 403].includes((error as ResponseError).statusCode) &&
                <Authenticate backend={selected}></Authenticate>
            }
            {
                !error && !loading &&
                <div className='mt-7'>
                    <div className='flex justify-between items-center'>
                        <Typography variant='h5'>Jobs ({data.length})</Typography>
                        {
                            selectedJobs.length > 0 &&
                            <Button color='primary' variant='contained' onClick={() => setModalOpen(true)}>Publish
                                ({selectedJobs.length})</Button>
                        }
                    </div>
                    <div>
                        <JobTable jobs={data} setSelectedJobs={setSelectedJobs}/>
                    </div>
                </div>
            }
            {selected && <PublishModal backend={selected} jobs={selectedJobs} open={modalOpen} handleClose={() => setModalOpen(false)}/> }
        </div>
}