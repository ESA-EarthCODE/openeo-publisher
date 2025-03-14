'use client';

import {AppBar, Avatar, Chip, IconButton, ListItemIcon, Menu, MenuItem, Toolbar, Typography} from "@mui/material";
import React from "react";
import {signOut, useSession} from "next-auth/react";
import {Logout} from "@mui/icons-material";
import {User} from "next-auth";
import { version } from '../package.json';
import moment from "moment";

export const NavBar = () => {
    const {data: session, status} = useSession()
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    if (session?.tokenExpired) {
        console.warn('User session has expired, logging out');
        signOut().then();
    }

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const getAvatar = (user: User | undefined) => {
        if (!user) {
            return <></>
        } else {
            return <Chip sx={{height: 36}}
                         aria-controls={open ? 'account-menu' : undefined}
                         aria-haspopup="true"
                         aria-expanded={open ? 'true' : undefined}
                         onClick={handleClick}
                         className='!bg-neutral-100'
                         avatar={user.image ? <Avatar alt={user.name || 'Unknown'} src={user.image}/> :
                             <Avatar>{(user?.name || 'U')[0]}</Avatar>}
                         label={user.name}
            />
        }
    }

    const handleLogout = async () => {
        await signOut();
        handleClose();
    }

    return <AppBar position="static">
        <Toolbar>
            <IconButton
                size="large"
                edge="start"
                color="inherit"
                aria-label="menu"
                sx={{mr: 2, mt: 10, mb: 4}}
            >
            </IconButton>
            <div className='flex-1 flex flex-col'>
                <Typography variant="h4" component="div" sx={{flexGrow: 1, fontWeight: 'bold'}}>
                    EarthCODE - openEO Publisher
                </Typography>
                <span>Publish your openEO jobs to the EarthCODE Open Science Catalog</span>
            </div>
            {getAvatar(session?.user)}
            <Menu
                anchorEl={anchorEl}
                id="account-menu"
                open={open}
                onClose={handleClose}
                onClick={handleClose}
                slotProps={{
                    paper: {
                        elevation: 0,
                        sx: {
                            overflow: 'visible',
                            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                            mt: 1.5,
                            '& .MuiAvatar-root': {
                                width: 32,
                                height: 32,
                                ml: -0.5,
                                mr: 1,
                            },
                            '&::before': {
                                content: '""',
                                display: 'block',
                                position: 'absolute',
                                top: 0,
                                right: 20,
                                width: 10,
                                height: 10,
                                bgcolor: 'background.paper',
                                transform: 'translateY(-50%) rotate(45deg)',
                                zIndex: 0,
                            },
                        },
                    },
                }}
                transformOrigin={{horizontal: 'right', vertical: 'top'}}
                anchorOrigin={{horizontal: 'right', vertical: 'bottom'}}
            >
                <MenuItem onClick={handleLogout}>
                    <ListItemIcon>
                        <Logout fontSize="small"/>
                    </ListItemIcon>
                    Logout
                </MenuItem>
                <MenuItem disabled>
                    <span className='text-xs italic text-center w-full mt-2'>{version}</span>
                </MenuItem>
            </Menu>
        </Toolbar>
    </AppBar>
}