import {OidcIssuerInfo, OpenEOBackend, OpenEOCredentialsProvider} from "./models";
import {ResponseError} from "../utils/ResponseError";
import {headers} from "next/headers";
import {getOpenEOJobs} from "./jobs";

export const getOpenEOBackends = async (): Promise<OpenEOBackend[]> => {
    const endpoints = (process.env.NEXT_PUBLIC_OPENEO_BACKENDS || '').split(',');
    const backends: OpenEOBackend[] = [];

    for (const url of endpoints) {
        try {
            backends.push(await getBackend(url));
        } catch (e) {
            console.warn(`Could not fetch information: ${e}`);
        }
    }

    return backends;

}

export const getBackend = async (url: string): Promise<OpenEOBackend> => {
    const response = await fetch(url);

    if (response.ok) {
        const body = await response.json();
        return {
            id: body.id,
            url,
            title: body.title,
            version: body.version,
            description: body.description,
            links: body.links,
        }
    } else {
        throw new ResponseError(response.status, response.statusText, `Received error from backend ${url}: ${await response.text()}`);
    }
}

const getIssuesInfo = async (url: string): Promise<OidcIssuerInfo> => {
    const response = await fetch(url);

    if (response.ok) {
        return await response.json();
    } else {
        throw new ResponseError(response.status, response.statusText, `Received error while retrieving Issues info from ${url}: ${await response.text()}`);
    }


}

export const getCredentialProviders = async (url: string): Promise<OpenEOCredentialsProvider[]> => {

    const response = await fetch(`${url}/credentials/oidc`);

    if (response.ok) {
        const body = await response.json();
        return await Promise.all(
            body.providers
                .filter((p: OpenEOCredentialsProvider) => p.default_clients?.length > 0)
                .map(async (p: OpenEOCredentialsProvider) => ({
                    ...p,
                    issuerInfo: await getIssuesInfo(p.issuer)
                }))
        )
    } else {
        throw new ResponseError(response.status, response.statusText, `Received error while retrieving Credential Providers from ${url}: ${await response.text()}`);
    }
}

export const isAuthenticated= async (backend: OpenEOBackend): Promise<boolean> => {
    try {
       await getOpenEOJobs(backend);
       return true;
    } catch (e) {
        return false;
    }
}