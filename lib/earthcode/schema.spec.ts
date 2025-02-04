import jobResults from '../../tests/fixture/responses/jobresults.json';
import productCollection
    from '../../tests/fixture/earthcode/products/worldcereal-maize-detection-belgium/collection.json';
import {createProductCollection} from "./schema";

describe("Test EarthCODE Schema Conversion", () => {

    it("Create products", () => {
        const experiment = createProductCollection('worldcereal-maize-detection-belgium', 'worldcereal', jobResults);

        expect(experiment).toEqual(productCollection)

    });
});
