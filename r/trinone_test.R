trinone <- read.table("TrinOne.csv",header = TRUE,row.names = "OBJECTID",sep = ",",fileEncoding = "UTF-8")
myvars <- c("TGCGCY","FKYD","GTYP","GTPC","TG_SKXJR","GXXM","GXXMQD","ZDXM","CG_SKXJR","CGYDDM","SKX","JBNT")
trinone2 <- trinone[myvars]

trinone2$CGLD <- 0
trinone2$CGLD[trinone2$CGYDDM == "G1" | trinone2$CGYDDM == "G2"] <- 1

myvar2 <- "CGYDDM"
trinone3 <- trinone2[!myvar2]
trinone3[is.na(trinone3)] <- 0
