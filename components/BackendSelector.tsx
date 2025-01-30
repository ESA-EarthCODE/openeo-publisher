import {useOpenEOBackends} from "../hooks/useOpenEOBackends";
import {useOpenEOStore} from "../store/openeo";
import React, {useEffect} from "react";
import {CircularProgress, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent} from "@mui/material";
import {OpenEOBackend} from "../lib/openeo/jobs.models";

export const BackendSelector = () => {

    const {data, error, loading} = useOpenEOBackends();
    const { selectedBackend, setSelectedBackend } = useOpenEOStore();

    useEffect(() => {
        if (!selectedBackend && data.length > 0) {
            setSelectedBackend(data[0]); // Set the first backend as default
        }
    }, [data, selectedBackend, setSelectedBackend]);

    const handleChange = (event: SelectChangeEvent<string>) => {
        const backend = data.find((b: OpenEOBackend) => b.id === event.target.value);
        if (backend) {
            setSelectedBackend(backend);
        }
    };

    const renderBackendOptions = () =>
        data.map((b: OpenEOBackend, idx: number) => (
            <MenuItem key={`backend-${idx}`} value={b.id} data-testid='backend-selector-item'>
                {b.title}
            </MenuItem>
        ));

    return <div>
        {
            loading && <CircularProgress color="inherit"/>
        }
        {
            !loading && data.length > 0 &&
            <div className='bg-white rounded-md my-2'>
                <FormControl variant="filled">
                    <InputLabel id="openeo-backend-label">Backend</InputLabel>
                    <Select
                        labelId="openeo-backend-label"
                        value={selectedBackend?.id || ''}
                        onChange={handleChange}
                        data-testid='backend-selector'
                    >
                        {renderBackendOptions()}
                    </Select>
                </FormControl>
            </div>
        }
    </div>
}