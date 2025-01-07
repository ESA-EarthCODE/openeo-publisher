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