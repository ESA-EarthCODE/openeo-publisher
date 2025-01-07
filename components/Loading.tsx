import {CircularProgress} from "@mui/material";

export const Loading = () => {
    return <div className='w-full h-full flex items-center justify-center'>
        <CircularProgress color='primary'/>
    </div>
}