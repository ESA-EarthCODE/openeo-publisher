'use client';

import {
    AppBar,
    CircularProgress,
    FormControl,
    IconButton,
    InputLabel,
    MenuItem,
    Select,
    SelectChangeEvent,
    Toolbar,
    Typography
} from "@mui/material";
import React, {useEffect, useState} from "react";
import {useOpenEOBackends} from "../hooks/useOpenEOBackends";
import {OpenEOBackend} from "../lib/openeo/models";
import {useOpenEOStore} from "../store/openeo";


export const NavBar = () => {

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
            <MenuItem key={`backend-${idx}`} value={b.id}>
                {b.title}
            </MenuItem>
        ));

    return <AppBar position="static">
        <Toolbar>
            <IconButton
                size="large"
                edge="start"
                color="inherit"
                aria-label="menu"
                sx={{mr: 2}}
            >
            </IconButton>
            <Typography variant="h6" component="div" sx={{flexGrow: 1}}>
                EarthCODE - openEO Publisher
            </Typography>
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
                        >
                            {renderBackendOptions()}
                        </Select>
                    </FormControl>
                </div>
            }
        </Toolbar>
    </AppBar>
}