import xarray
from openeo_udf.api.datacube import DataCube


def apply_datacube(cube: DataCube, context) -> DataCube:
    import xarray
    import numpy as np

    # Get the x array containing the time series
    array: xarray.DataArray = cube.get_array()
    min = 0.85
    max = 1.15
    step = 0.1
    mean = array.median(skipna=True)
    bins = np.arange(min, max + step, step) * mean.values.tolist()
    bins = np.concatenate([[0], bins, [255]])
    buckets = np.digitize(array.values, bins=bins).astype(float)
    return DataCube(
        xarray.DataArray(
            buckets,
            coords={
                "t": array.t.values,
                "bands": array.bands.values,
                "y": array.y.values,
                "x": array.x.values,
            },
            dims=["t", "bands", "y", "x"],
        )
    )
