var l5 = ee.ImageCollection("LANDSAT/LT5_L1T_TOA_FMASK"),
    l7 = ee.ImageCollection("LANDSAT/LE7_L1T_TOA_FMASK"),
    l8 = ee.ImageCollection("LANDSAT/LC8_L1T_TOA"),
    l4 = ee.ImageCollection("LANDSAT/LT4_L1T_TOA_FMASK"),
    geometry = /* color: #98ff00 */ee.Geometry.Polygon(
        [[[55.1019287109375, 25.27305470179173],
          [55.10398864746094, 25.174287959359553],
          [55.210418701171875, 25.186094492273316],
          [55.2117919921875, 25.272433778048768]]]);



// define the period
var years = ee.List.sequence(1988,2016,1)
print(years)

var l4names = ee.List(["B1","B2","B3","B4","B5","B6","B7","fmask"])
var l5names = ee.List(["B1","B2","B3","B4","B5","B6","B7","fmask"])
var l7names = ee.List(["B1","B2","B3","B4","B5","B6_VCID_1","B6_VCID_2","B7","B8","fmask"])
var l8names = ee.List(["B1","B2","B3","B4","B5","B6","B7","B8","B9","B10","B11","BQA"])

// bands
var l4Bands = ee.List(['blue','green','red','nir','swir1','tir','swir2','fmask'])
var l5Bands = ee.List(['blue','green','red','nir','swir1','tir','swir2','fmask'])
var l7Bands = ee.List(['blue','green','red','nir','swir1','tir1','tir2', 'swir2','pan','fmask'])
var l8Bands = ee.List(['b1','blue','green','red','nir','swir1','swir2','cir','tir1','tir2','pan','BQA'])

// Filter based on location
var l4images  = l4.filterBounds(geometry)
var l5images  = l5.filterBounds(geometry)
var l7images  = l7.filterBounds(geometry)
var l8images  = l8.filterBounds(geometry)

// set cloud threshold
var cloud_thresh = 40;

// Functions
var cloudfunction = function(image){
  //use add the cloud likelihood band to the image
  var CloudScore = ee.Algorithms.Landsat.simpleCloudScore(image);
  //isolate the cloud likelihood band
  var quality = CloudScore.select('cloud');
  //get pixels above the threshold
  var cloud01 = quality.gt(cloud_thresh);
  //create a mask from high likelihood pixels
  var cloudmask = image.mask().and(cloud01.not());
  //mask those pixels from the image
  return image.updateMask(cloudmask);
};

// mask all clouds in the image collection
l4images = l4images.map(cloudfunction);
l5images = l5images.map(cloudfunction);
l7images = l7images.map(cloudfunction);
l8images = l8images.map(cloudfunction);

print(l4images);

// Change the bandnames
l4images = l4images.select(l4names,l4Bands);
l5images = l5images.select(l5names,l5Bands);
l7images = l7images.select(l7names,l7Bands);
l8images = l8images.select(l8names,l8Bands);

print(l4images);

// Combine all data in single collection
var myCollection = ee.ImageCollection((l4images.merge(l5images))
                                               .merge(l7images)
                                               .merge(l8images));

// Select the red, green an blue bands
//var myCollection = myCollection.select(['red','green','blue'])
var myCollection = myCollection.select(['swir1','nir','red'])

// calculate an image for every year
var yearlymap = ee.ImageCollection(years.map(function (y) {
      var image = myCollection.filter(ee.Filter.calendarRange(y, y, 'year'))
                              .median();
      return image.set('year', 2000)
                  .set('date', ee.Date.fromYMD(y,1,1))
                  .set('system:time_start',ee.Date.fromYMD(y,1,1));
}));

print(yearlymap)

// we need an 8-bit format
var coll4Video = yearlymap
  .map(function(image) {
    return image.multiply(512).uint8();   // need to make it 8-bit
  });
  
// export the video to the drive
Export.video.toDrive({
    collection: coll4Video,
    description: "dubai" , 
    scale: 30,
    framesPerSecond: 2,
    region: geometry
});