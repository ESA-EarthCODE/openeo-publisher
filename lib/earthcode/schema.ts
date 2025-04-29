import { Link, OpenEOJobResults } from "../openeo/results.models";
import {
  EarthCODEExperiment,
  EarthCODEProduct,
  EarthCODEProjectInfo,
  EarthCODEThemeInfo,
  EarthCODEWorkflow,
} from "./concepts.models";
import moment from "moment";

const getRel = (link: Link) => {
  if (link.rel === "canonical") {
    return "via";
  } else if (link.rel === "self") {
    return "item";
  } else {
    return link.rel;
  }
};

const createThemes = (themes: EarthCODEThemeInfo[]) => [
  {
    scheme: "https://github.com/stac-extensions/osc#theme",
    concepts: themes.map((t) => ({
      id: t.id,
    })),
  },
];

export const createProductCollection = (
  id: string,
  title: string,
  description: string,
  project: EarthCODEProjectInfo,
  themes: EarthCODEThemeInfo[],
  job: OpenEOJobResults
): EarthCODEProduct => {
  return {
    assets: job.assets,
    description: description,
    extent: job.extent,
    id,
    license: job.license,
    links: [
      ...job.links.map((l: Link) => ({
        ...l,
        rel: getRel(l),
      })),
      ...themes.map((t: EarthCODEThemeInfo) => ({
        rel: "related",
        href: `../../themes/${t.id}/catalog.json`,
        type: "application/json",
        title: `Theme: ${t.title}`,
      })),
      {
        rel: "related",
        href: `../../projects/${project.id}/collection.json`,
        type: "application/json",
        title: `Project: ${project.title}`,
      },
      {
        rel: "parent",
        href: "../catalog.json",
        type: "application/json",
        title: "Products",
      },
      {
        rel: "root",
        href: "../../catalog.json",
        type: "application/json",
        title: "Open Science Catalog",
      },
    ],
    stac_extensions: [
      "https://stac-extensions.github.io/osc/v1.0.0/schema.json",
      "https://stac-extensions.github.io/themes/v1.0.0/schema.json",
    ],
    stac_version: job.stac_version,
    title: title,
    type: job.type,
    "osc:missions": [],
    "osc:project": project.id,
    "osc:status": "completed",
    "osc:type": "product",
    "osc:variables": [],
    themes: createThemes(themes),
  };
};

export const getExperimentLink = (id: string) => ({
  rel: "related",
  href: `../../experiments/${id}/record.json`,
  type: "application/json",
  title: `Experiment: ${id}`,
});

export const createWorkflowCollection = (
  id: string,
  title: string,
  description: string,
  project: EarthCODEProjectInfo,
  themes: EarthCODEThemeInfo[],
  workflowUrl: string,
  experimentIds: string[]
): EarthCODEWorkflow => {
  return {
    type: "Feature",
    conformsTo: [
      "http://www.opengis.net/spec/ogcapi-records-1/1.0/req/record-core",
    ],
    geometry: null,
    id,
    links: [
      {
        rel: "root",
        href: "../../catalog.json",
        type: "application/json",
        title: "Open Science Catalog",
      },
      {
        rel: "parent",
        href: "../catalog.json",
        type: "application/json",
        title: "Workflows",
      },
      {
        rel: "related",
        href: `../../projects/${project.id}/collection.json`,
        type: "application/json",
        title: `Project: ${project.title}`,
      },
      ...themes.map((t: EarthCODEThemeInfo) => ({
        rel: "related",
        href: `../../themes/${t.id}/catalog.json`,
        type: "application/json",
        title: `Theme: ${t.title}`,
      })),
      {
        rel: "application",
        type: "application/json",
        title: "openEO Workflow",
        href: workflowUrl,
      },
      ...experimentIds.map((experiment) => getExperimentLink(experiment)),
    ],
    properties: {
      title,
      description,
      created: moment().toISOString(false),
      updated: moment().toISOString(false),
      type: "workflow",
      "osc:missions": [],
      "osc:project": project.id,
      "osc:status": "completed",
      "osc:type": "workflow",
      "osc:variables": [],
      "osc:region": "",
      themes: createThemes(themes),
    },
  };
};

export const createExperimentCollection = (
  id: string,
  title: string,
  description: string,
  license: string,
  project: EarthCODEProjectInfo,
  themes: EarthCODEThemeInfo[],
  workflow: EarthCODEWorkflow,
  product: EarthCODEProduct
): EarthCODEExperiment => {
  return {
    id,
    type: "Feature",
    conformsTo: [
      "http://www.opengis.net/spec/ogcapi-records-1/1.0/req/record-core",
    ],
    geometry: null,
    properties: {
      created: moment().toISOString(false),
      updated: moment().toISOString(false),
      type: "experiment",
      title,
      description,
      license,
      "osc:project": project.id,
      "osc:workflow": workflow.id,
      "osc:product": product.id,
      version: "2",
      themes: createThemes(themes),
    },
    links: [
      {
        rel: "root",
        href: "../../catalog.json",
        type: "application/json",
        title: "Open Science Catalog",
      },
      {
        rel: "parent",
        href: "../catalog.json",
        type: "application/json",
        title: "Experiments",
      },
      {
        rel: "input",
        href: "./input.yaml",
        type: "application/yaml",
        title: "Input parameters",
      },
      {
        rel: "environment",
        href: "./environment.yaml",
        type: "application/yaml",
        title: "Execution environment",
      },
      {
        rel: "process_graph",
        href: "./process_graph.json",
        type: "application/json",
        title: "openEO Process Graph",
      },
      {
        rel: "related",
        href: `../../workflows/${workflow.id}/record.json`,
        type: "application/json",
        title: `Workflow: ${workflow.properties.title}`,
      },
      {
        rel: "related",
        href: `../../products/${product.id}/collection.json`,
        type: "application/json",
        title: `Product: ${product.title}`,
      },
      {
        rel: "related",
        href: `../../projects/${project.id}/collection.json`,
        type: "application/json",
        title: `Project: ${project.title}`,
      },
      ...themes.map((t: EarthCODEThemeInfo) => ({
        rel: "related",
        href: `../../themes/${t.id}/catalog.json`,
        type: "application/json",
        title: `Theme: ${t.title}`,
      })),
    ],
  };
};
