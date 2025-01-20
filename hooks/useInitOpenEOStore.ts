import {useOpenEOStore} from "../store/openeo";
import {useEffect} from "react";

export const useInitOpenEOStore = () => {
    const { setSelectedBackend } = useOpenEOStore();

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const storedBackend = window.localStorage.getItem('openeo_backend');
            if (storedBackend && storedBackend !== 'undefined') {
                setSelectedBackend(JSON.parse(storedBackend));
            }
        }
    }, [setSelectedBackend]);
};