export interface OpenEOJobResults {
    assets: Assets
    description: string
    extent: Extent
    id: string
    license: string
    links: Link[]
    "openeo:status": string
    stac_extensions: string[]
    stac_version: string
    summaries: Summaries
    title: string
    type: string
}

export interface Assets {
    [key: string]: AssetDetails
}

export interface AssetDetails {
    href: string
    "proj:bbox": number[]
    "proj:epsg": number
    "proj:shape": number[]
    "raster:bands": Band[]
    roles: string[]
    title: string
    type: string
}

export interface Band {
    name: string
    statistics: Statistics
}

export interface Statistics {
    maximum: number
    mean: number
    minimum: number
    stddev: number
    valid_percent: number
}

export interface Extent {
    spatial: Spatial
    temporal: Temporal
}

export interface Spatial {
    bbox: number[][]
}

export interface Temporal {
    interval: any[][]
}

export interface Link {
    href: string
    rel: string
    title?: string
    type?: string
}

export interface Summaries { }
