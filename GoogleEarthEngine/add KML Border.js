// Create a feature collection from a Fusion Table.
//
// Select "desert" features from the TNC Ecoregions fusion table.
var fc = ee.FeatureCollection('ft:1P4dfTOy3o_MBdw9Qye300lOkKk7u7irkyw-5OEGv','geometry');

var geometry = ee.Geometry.Polygon(
        [[[107.23617553710938, 23.914714982799392],
          [107.23617553710938, 23.193736448124000],
          [107.90634155273438, 23.193736448124000],
          [107.90634155273438, 23.914714982799392]]]);
          
// Fill, then outline the polygons into a blank image.
var image = ee.Image().toByte()
    //.paint(fc, 'fill')       // Get color from property named 'fill'
    .paint(fc, 2, 2);        // Outline using color 3, width 5.

var image2 = ee.Image().toByte()
    .paint(geometry,1,2);
Map.addLayer(image);
Map.addLayer(image2);

Map.setCenter(107.55, 23.55,10);
