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
    created: string;
    progress: number;
    status: string;
    title: string;
}

export interface OpenEOJobDetails extends OpenEOJob {
    process: any,
    usage: any
}

export interface OpenEOCredentialsClient {
    grant_types: string[];
    id: string;
    redirect_url: string;
}

export  interface OidcIssuerInfo {
    realm: string;
    public_key: string;
    "token-service" :string;
    "account-service": string;
}

export interface OpenEOCredentialsProvider {
    id: string;
    title: string[];
    issuer: string;
    scopes: string[];
    default_clients: OpenEOCredentialsClient[];
    issuerInfo: OidcIssuerInfo;
}


