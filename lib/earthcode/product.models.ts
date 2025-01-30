import {Assets, Extent, Link} from "../openeo/results.models";

export interface EarthCODEProduct {
    type: string
    id: string
    stac_version: string
    description: string
    title: string
    license: string
    stac_extensions: string[]
    "osc:type": string
    "osc:status": string
    "osc:project": string
    "osc:variables": any[]
    "osc:missions": any[]
    extent: Extent
    links: Link[]
    assets: Assets
}