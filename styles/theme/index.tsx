'use client';
import {createTheme, ThemeOptions} from '@mui/material/styles';

const index = createTheme({
    palette: {
        mode: 'light',
        primary: {
            main: '#001923',
        },
        secondary: {
            main: '#89d6d2',
        },
    },
    typography: {
        fontFamily: ['NotesESA', 'Roboto'].join(','),
    }
});

export default index;