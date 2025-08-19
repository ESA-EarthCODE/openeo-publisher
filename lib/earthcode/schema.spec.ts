import jobResults from "../../tests/fixture/responses/jobresults.json";
import productCollection from "../../tests/fixture/earthcode/products/worldcereal-maize-detection-product/collection.json";
import workflowCollection from "../../tests/fixture/earthcode/workflows/worldcereal-maize-detection-workflow/record.json";
import experimentCollection from "../../tests/fixture/earthcode/experiments/worldcereal-maize-detection-experiment/record.json";

import {
  createExperimentCollection,
  createProductCollection,
  createWorkflowCollection,
} from "./schema";
import { EarthCODEProjectInfo } from "./concepts.models";
import { ProductAsset } from "./schema.model";
import { OpenAsBlobOptions } from "fs";
import { OpenEOBackend } from "lib/openeo/jobs.models";

describe("Test EarthCODE Schema Conversion", () => {
  const testProject: EarthCODEProjectInfo = {
    id: "worldcereal",
    title: "ESA WorldCereal",
  };
  const testThemes = [{ id: "test", title: "TEST" }];

  const testAssets: ProductAsset[] = [
    { name: "test1", url: "https://test-asset-1.test" },
  ];

  const testBackend: OpenEOBackend = {
    id: "openeo-federated-test",
    url: "https://openeofed.dataspace.copernicus.eu",
    title: "Foo Bar",
    version: "v1.0",
    description: "Test Backend",
    links: [],
  };

  it("should create a product scheme", () => {
    const product = createProductCollection(
      "worldcereal-maize-detection-product",
      "WorldCereal Crop Extent - Belgium",
      "Results for batch job cdse-j-25020410530548a7aef81c62faebd127",
      testProject,
      testThemes,
      testAssets,
      jobResults as any
    );
    expect(product).toEqual(productCollection);
  });

  it("should create a workflow scheme", async () => {
    const workflow = await createWorkflowCollection(
      "worldcereal-maize-detection-workflow",
      "ESA worldcereal global maize detector",
      "A maize detection algorithm",
      testProject,
      testThemes,
      testBackend,
      "https://raw.githubusercontent.com/WorldCereal/worldcereal-classification/refs/tags/worldcereal_crop_type_v1.0.0/src/worldcereal/udp/worldcereal_crop_type.json",
      ["foobar"]
    );
    workflow.properties.created = "2025-02-19T23:00:00Z";
    workflow.properties.updated = "2025-02-19T23:00:00Z";
    expect(workflow).toEqual(workflowCollection);
  });

  it("should create an experiment scheme with an url", async () => {
    const product = createProductCollection(
      "worldcereal-maize-detection-product",
      "WorldCereal Crop Extent - Belgium",
      "Results for batch job cdse-j-25020410530548a7aef81c62faebd127",
      testProject,
      testThemes,
      testAssets,
      jobResults as any
    );
    const workflow = await createWorkflowCollection(
      "worldcereal-maize-detection-workflow",
      "ESA worldcereal global maize detector",
      "A maize detection algorithm",
      testProject,
      testThemes,
      testBackend,
      "https://raw.githubusercontent.com/WorldCereal/worldcereal-classification/refs/tags/worldcereal_crop_type_v1.0.0/src/worldcereal/udp/worldcereal_crop_type.json",
      ["foobar"]
    );

    const experiment = createExperimentCollection(
      "worldcereal-maize-detection-experiment",
      "ESA worldcereal global maize detector for Belgium",
      "A test experiment",
      "CC-BY-SA-4.0",
      testProject,
      testThemes,
      testBackend,
      workflow,
      product,
      "https://foo.bar/process_graph.json"
    );
    experiment.properties.created = "2025-02-19T23:00:00Z";
    experiment.properties.updated = "2025-02-19T23:00:00Z";
    expect(experiment).toEqual(experimentCollection);
  });
});
