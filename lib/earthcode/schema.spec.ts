import jobResults from '../../tests/fixture/responses/jobresults.json';
import productCollection
    from '../../tests/fixture/earthcode/products/worldcereal-maize-detection-product/collection.json';
import workflowCollection
    from '../../tests/fixture/earthcode/workflows/worldcereal-maize-detection-workflow/record.json';
import experimentCollection
    from '../../tests/fixture/earthcode/experiments/worldcereal-maize-detection-experiment/record.json';

import {createExperimentCollection, createProductCollection, createWorkflowCollection} from "./schema";
import {EarthCODEProjectInfo} from "./concepts.models";

describe("Test EarthCODE Schema Conversion", () => {

    const testProject: EarthCODEProjectInfo = {
        id: 'worldcereal',
        title: 'ESA WorldCereal'
    }
    const testThemes = [{id: 'test', title: 'TEST'}]

    it("should create a product scheme", () => {
        const product = createProductCollection(
            'worldcereal-maize-detection-product',
            'WorldCereal Crop Extent - Belgium',
            'Results for batch job cdse-j-25020410530548a7aef81c62faebd127',
            testProject,
            testThemes,
            jobResults as any
        );
        expect(product).toEqual(productCollection)
    });

    it("should create a workflow scheme", () => {
        const workflow = createWorkflowCollection(
            'worldcereal-maize-detection-workflow',
            'ESA worldcereal global maize detector',
            'A maize detection algorithm',
            testProject,
            testThemes,
            'https://raw.githubusercontent.com/WorldCereal/worldcereal-classification/refs/tags/worldcereal_crop_type_v1.0.0/src/worldcereal/udp/worldcereal_crop_type.json',
            ['foobar']
        );
        workflow.properties.created = '2025-02-19T23:00:00Z'
        workflow.properties.updated = '2025-02-19T23:00:00Z'
        expect(workflow).toEqual(workflowCollection)
    });

    it("should create an experiment scheme", () => {
        const product = createProductCollection(
            'worldcereal-maize-detection-product',
            'WorldCereal Crop Extent - Belgium',
            'Results for batch job cdse-j-25020410530548a7aef81c62faebd127',
            testProject,
            testThemes,
            jobResults as any
        );
        const workflow = createWorkflowCollection(
            'worldcereal-maize-detection-workflow',
            'ESA worldcereal global maize detector',
            'A maize detection algorithm',
            testProject,
            testThemes,
            'https://raw.githubusercontent.com/WorldCereal/worldcereal-classification/refs/tags/worldcereal_crop_type_v1.0.0/src/worldcereal/udp/worldcereal_crop_type.json',
            ['foobar']
        );

        const experiment = createExperimentCollection(
            'worldcereal-maize-detection-experiment',
            'ESA worldcereal global maize detector for Belgium',
            'A test experiment',
            'CC-BY-SA-4.0',
            testProject,
            testThemes,
            workflow,
            product
        );
        experiment.properties.created = '2025-02-19T23:00:00Z'
        experiment.properties.updated = '2025-02-19T23:00:00Z'
        expect(experiment).toEqual(experimentCollection)
    });


});
