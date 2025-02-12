'use client';

import {AppBar, IconButton, Toolbar, Typography, Avatar, Chip} from "@mui/material";
import React from "react";
import {useSession} from "next-auth/react";
import {signOutApp} from "../lib/auth";


export const NavBar = () => {
    const {data: session} = useSession()

    const getAvatar = (user) => {
        if (!user) {
            return <></>
        } else {
            return <Chip onClick={async() => await signOutApp()} className='!bg-neutral-100' avatar={user.image ? <Avatar alt={user.name} src={user.image} /> : <Avatar>{user.name[0]}</Avatar> } label={user.name}/>
        }
    }

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
            { getAvatar(session?.user)}
        </Toolbar>
    </AppBar>
}