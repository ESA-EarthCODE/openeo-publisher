import jobResults from '../../tests/fixture/responses/jobresults.json';
import productCollection
    from '../../tests/fixture/earthcode/products/worldcereal-maize-detection-product/collection.json';
import workflowCollection
    from '../../tests/fixture/earthcode/workflows/worldcereal-maize-detection-workflow/record.json';
import experimentCollection
    from '../../tests/fixture/earthcode/experiments/worldcereal-maize-detection-experiment/record.json';

import {createExperimentCollection, createProductCollection, createWorkflowCollection} from "./schema";

describe("Test EarthCODE Schema Conversion", () => {

    it("should create a product scheme", () => {
        const experiment = createProductCollection('worldcereal-maize-detection-product', 'worldcereal', jobResults as any);
        expect(experiment).toEqual(productCollection)
    });

    it("should create a workflow scheme", () => {
        const experiment = createWorkflowCollection('worldcereal-maize-detection-workflow', 'ESA worldcereal global maize detector', 'A maize detection algorithm', 'worldcereal', 'https://raw.githubusercontent.com/WorldCereal/worldcereal-classification/refs/tags/worldcereal_crop_type_v1.0.0/src/worldcereal/udp/worldcereal_crop_type.json', ['foobar']);
        experiment.properties.created = '2025-02-19T23:00:00Z'
        experiment.properties.updated = '2025-02-19T23:00:00Z'
        expect(experiment).toEqual(workflowCollection)
    });

    it("should create an experiment scheme", () => {
        const experiment = createExperimentCollection('worldcereal-maize-detection-experiment', 'ESA worldcereal global maize detector for Belgium', 'A test experiment', 'CC-BY-SA-4.0', 'worldcereal-maize-detection-workflow', 'worldcereal-maize-detection-product');
        experiment.properties.created = '2025-02-19T23:00:00Z'
        experiment.properties.updated = '2025-02-19T23:00:00Z'
        expect(experiment).toEqual(experimentCollection)
    });


});
