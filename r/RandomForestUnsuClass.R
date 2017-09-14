# Author: Xu Dong
# Date: 05/27/2017
# Before running the script, Please:
# Set working Directory with Files-Browse, then More-Set As WD

library("raster")
library("cluster")
library("randomForest")

wd <- getwd()
wdStrSplit <- strsplit(wd, "/")
landsatName <- tail(wdStrSplit[[1]],1)


imageR <- raster(paste(landsatName,"_B6.tif",sep = ""))
imageG <- raster(paste(landsatName,"_B5.tif",sep = ""))
imageB <- raster(paste(landsatName,"_B4.tif",sep = ""))
image = stack(imageR,imageG,imageB)
plotRGB(image,r=1,g=2,b=3,stretch="hist")

v <- getValues(image)
i <- which(!is.na(v))
v <- na.omit(v)

vx<-v[sample(nrow(v), 500),]
rf = randomForest(vx)
rf_prox <- randomForest(vx,ntree = 1000, proximity = TRUE)$proximity

E_rf <- kmeans(rf_prox, 12, iter.max = 100, nstart = 10)
rf <- randomForest(vx,as.factor(E_rf$cluster),ntree = 500)
rf_raster<- predict(image,rf)

writeRaster(rf_raster,"US_Classification654",format="GTiff")