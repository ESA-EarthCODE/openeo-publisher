'use client';

import {useEffect} from 'react';
import {Loading} from "@/components/Loading";
import {OpenEOBackend, OpenEOCredentialsProvider} from "../lib/openeo/models";
import {getCredentialProviders, getOpenEOBackends} from "../lib/openeo/backends";
import {useRouter} from "next/navigation";
import {useToastStore} from "../store/toasts";

export const CallbackPage = () => {
    const router = useRouter();
    const { addToast } = useToastStore();

    useEffect(() => {
        const fetchToken = async () => {

            const backends = await getOpenEOBackends();

            // Get query parameters from the URL
            const urlParams = new URLSearchParams(window.location.search);
            const info = window.location.pathname.split("/").splice(2);
            const code = urlParams.get('code');

            // Parse backend and provider info (assuming info contains backend and provider)
            const backendId = info[0];
            const providerId = info[1];

            // Use the backendId and providerId to fetch the relevant provider configuration
            const backend = backends.find((b: OpenEOBackend) => b.id === backendId);
            if (code && backend) {
                const credentialProviders = await getCredentialProviders(backend.url);
                const provider = credentialProviders.find((p: OpenEOCredentialsProvider) => p.id === providerId);
                const redirectUrl = `${window.location.origin}${window.location.pathname}`;

                if (provider) {
                    const tokenEndpoint = `${provider.issuer}/protocol/openid-connect/token`;
                    const body = new URLSearchParams({
                        grant_type: 'authorization_code',
                        code: code || '',
                        redirect_uri: redirectUrl,
                        client_id: provider.default_clients[0].id,
                    });

                    try {
                        const response = await fetch(tokenEndpoint, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/x-www-form-urlencoded',
                            },
                            body,
                        });

                        if (response.ok) {
                            const data = await response.json();

                            // Store the access token in localStorage or cookies
                            localStorage.setItem(`access_token_${backend.id}`, `oidc/${provider.id}/${data.access_token}`);
                        } else {
                            console.error('Failed to fetch token:', await response.text());
                            addToast({
                                message: `Failed to fetch token for ${backend.title}`,
                                severity: 'error',
                            });
                        }
                    } catch (error) {
                        addToast({
                            message: `Failed to exchange token for ${backend.title}`,
                            severity: 'error',
                        });
                        console.error('Error during token exchange:', error);
                    }
                }
                router.push('/');
            }
        };

        fetchToken();
    }, [router]);

    return <Loading/>;
}
