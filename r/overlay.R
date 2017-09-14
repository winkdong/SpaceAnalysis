library("raster")
setwd("D:/geodatabase/Xiantao/tif")
DBWD <- raster("DBWD.tif")
YHMJ <- raster("GHYHMJBL0519.tif")
NLFX <- raster("NLFXQ0519.tif")
pipeline <- raster("pipeline_density_skm0519.tif")

plot(pipeline)
cellStats(DBWD,"min")
rescale <- function(x) {(x-cellStats(x,"min"))/(cellStats(x,"max")-cellStats(x,"min"))}
DBWD_n <- rescale(DBWD)
pipeline_n <- rescale(pipeline)
YHMJ_n <- rescale(YHMJ)
pipeline_n2 <- 1-pipeline_n

writeRaster(DBWD_n,"DBWD_n",format="GTiff")
writeRaster(pipeline_n,"pipeline_n",format="GTiff")
writeRaster(YHMJ_n,"YHMJ_n",format="GTiff")
writeRaster(pipeline_n2,"pipeline_n2",format="GTiff")



# sr <- "+proj=utm +zone=49 +datum=WGS84 +units=m +no_defs +ellps=WGS84 +towgs84=0,0,0"
# YHMJ_84 <- projectRaster(YHMJ,crs = sr)
# NLFX_84 <- projectRaster(NLFX,crs = sr)
# pipeline_84 <- projectRaster(pipline_n,crs = sr)
# 
# XT_overlay <- DBWD_n*0.25+pipeline_84*0.25+YHMJ_84*0.25+NLFX_84*0.25