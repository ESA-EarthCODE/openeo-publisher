import {OpenEOBackend, OpenEOCredentialsProvider} from "../lib/openeo/models";
import {useOpenEOCredentialsProvider} from "../hooks/useOpenEOCredentialsProvider";
import {Loading} from "@/components/Loading";
import {Alert, Button, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, Typography} from "@mui/material";
import React, {useEffect, useState} from "react";


export interface AuthenticateProps {
    backend: OpenEOBackend;

}

export const Authenticate = ({backend}: AuthenticateProps) => {
    const {data, loading, error} = useOpenEOCredentialsProvider(backend);
    const [selectedProvider, setSelectedProvider] = useState<OpenEOCredentialsProvider | null>(null);

    useEffect(() => {
        setSelectedProvider(null);
    }, []);

    useEffect(() => {
        if (!selectedProvider && data.length > 0) {
            setSelectedProvider(data[0]); // Set the first backend as default
        }
    }, [data, selectedProvider, setSelectedProvider]);

    const handleChange = (event: SelectChangeEvent<string>) => {
        const provider = data.find((p: OpenEOCredentialsProvider) => p.id === event.target.value);
        if (provider) {
            setSelectedProvider(provider);
        }
    };

    const renderAuthOptions = () =>
        data.map((provider: OpenEOCredentialsProvider, idx: number) => (
            <MenuItem key={`provider-${idx}`} value={provider.id}>
                {provider.title}
            </MenuItem>
        ));


    const authenticate = () => {
        if (selectedProvider) {
            const redirectUrl = `${window.location.origin}/callback/${backend.id}/${selectedProvider.id}`; // Define your callback URL
            const loginUrl = `${selectedProvider.issuerInfo["token-service"]}/auth?client_id=${encodeURIComponent(
                selectedProvider.default_clients[0].id
            )}&redirect_uri=${encodeURIComponent(redirectUrl)}&response_type=code&scope=${encodeURIComponent(selectedProvider.scopes.join(' '))}`;

            console.log(redirectUrl);
            window.location.href = loginUrl;
        }
    }

    if (loading) {
        return <Loading/>;
    } else if (data && data.length > 0) {
        return <div>
            <Typography variant='h5'>Authenticate</Typography>
            <div className='mt-2 mb-5 text-neutral-500'>Please select the authentication provider and login to the
                openEO backend.
            </div>
            <div className='flex flex-col gap-2 w-96'>
                <FormControl variant="filled">
                    <InputLabel id="openeo-provider-label">Provider</InputLabel>
                    <Select
                        labelId="openeo-provider-label"
                        value={selectedProvider?.id || ''}
                        onChange={handleChange}
                    >
                        {renderAuthOptions()}
                    </Select>
                </FormControl>
                <Button disabled={!selectedProvider} color='primary' variant='contained' size='large'
                        onClick={authenticate}>Authenticate</Button>
            </div>
        </div>

    } else {
        return <div className='rounded-lg'>
            <Alert
                severity='error'
                variant="standard"
            >
                <span className='font-bold'>Unable to authenticate</span><br/>
                {backend.title} does not provide an valid authentication provider.
            </Alert>
        </div>
    }
}