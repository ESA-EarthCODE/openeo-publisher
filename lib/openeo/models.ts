export interface OpenEOLink {
    href: string;
    rel: string;
    type: string;
}

export interface OpenEOBackend {
    id: string;
    url: string;
    title: string;
    version: string;
    description: string;
    links: OpenEOLink[];
}

export interface OpenEOJob {
    id: string;
}

export interface OpenEOCredentialsClient {
    grant_types: string[];
    id: string;
    redirect_url: string;
}

export interface OpenEOCredentialsProvider {
    id: string;
    title: string[];
    issuer: string;
    scopes: string[];
    default_clients: OpenEOCredentialsClient[];
}