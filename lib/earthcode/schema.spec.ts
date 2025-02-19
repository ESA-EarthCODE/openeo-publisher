import jobResults from '../../tests/fixture/responses/jobresults.json';
import productCollection
    from '../../tests/fixture/earthcode/products/worldcereal-maize-detection-belgium/collection.json';
import workflowCollection
    from '../../tests/fixture/earthcode/workflows/worlkdcereal-maize-detection-workflow/collection.json';
import {createProductCollection, createWorkflowCollection} from "./schema";

describe("Test EarthCODE Schema Conversion", () => {

    it("should create a product scheme", () => {
        const experiment = createProductCollection('worldcereal-maize-detection-belgium', 'worldcereal', jobResults);
        expect(experiment).toEqual(productCollection)
    });

    it("should create a workflow scheme", () => {
        const experiment = createWorkflowCollection('worldcereal-maize-detection-workflow', 'ESA worldcereal global maize detector', 'A maize detection algorithm', 'worldcereal', jobResults);
        expect(experiment).toEqual(workflowCollection)
    });


});
