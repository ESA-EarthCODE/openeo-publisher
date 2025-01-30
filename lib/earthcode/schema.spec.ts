import jobResults from '../../tests/fixture/responses/jobresults.json';
import productCollection
    from '../../tests/fixture/earthcode/products/cdse-j-25011508535642eea9c8b4a7e5cfde0a/collection.json';
import {createProductCollection} from "./schema";

describe("Test EarthCODE Schema Conversion", () => {

    it("Create products", () => {
        const experiment = createProductCollection('test-project', jobResults);

        expect(experiment).toEqual(productCollection)

    });
});
