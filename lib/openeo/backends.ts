import {OpenEOBackend} from "./models";

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
        throw new Error(`Received error from backend ${url}: ${response.status} - ${response.statusText} - ${await response.text()}`);
    }
}