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
import {OpenEOBackend} from "../lib/openeo/jobs.models";
import {useOpenEOStore} from "../store/openeo";
import {BackendSelector} from "@/components/BackendSelector";


export const NavBar = () => {


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
        </Toolbar>
    </AppBar>
}