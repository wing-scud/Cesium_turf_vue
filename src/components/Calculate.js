
//绘制小矩形面 四个经纬度的点，z值高度可以忽略 如：113.xx  ,37.xx,0 ,113.xx,37.xx,0
 function drawSlopePolygon(startx1, starty1, startz1, startx2, starty2, startz2, startx3, starty3, startz3, startx4, starty4, startz4) {

    //高度z全为0
    var count = 100;
    var slopelineposition = [];
    var hireacys = [];
    var hireacysdistance = []
    for (let j = 0; j < 100; j++) {
        for (var i = 0; i < 100; i++) {
            var hireacy = [];
            //分割成小面，切分经纬度
            hireacy.push(new Cesium.Cartesian3(startx1 + (startx2 - startx1) / count * i + (startx4 + (startx3 - startx4) / count * (i) - startx1 - (startx2 - startx1) / count * i) / count * j,
                starty1 + (starty2 - starty1) / count * i + (starty4 + (starty3 - starty4) / count * (i) - starty1 - (starty2 - starty1) / count * i) / count * j,
                startz1 + (startz2 - startz1) / count * i + (startz4 + (startz3 - startz4) / count * (i) - startz1 - (startz2 - startz1) / count * i) / count * j))
            hireacy.push(new Cesium.Cartesian3(startx1 + (startx2 - startx1) / count * (i + 1) + (startx4 + (startx3 - startx4) / count * (i + 1) - startx1 - (startx2 - startx1) / count * (i + 1)) / count * j,
                starty1 + (starty2 - starty1) / count * (i + 1) + (starty4 + (starty3 - starty4) / count * (i + 1) - starty1 - (starty2 - starty1) / count * (i + 1)) / count * j,
                startz1 + (startz2 - startz1) / count * (i + 1) + (startz4 + (startz3 - startz4) / count * (i + 1) - startz1 - (startz2 - startz1) / count * (i + 1)) / count * j))
            hireacy.push(new Cesium.Cartesian3(startx4 + (startx3 - startx4) / count * (i + 1) - (startx4 + (startx3 - startx4) / count * (i + 1) - startx1 - (startx2 - startx1) / count * (i + 1)) / count * (count - 1 - j),
                starty4 + (starty3 - starty4) / count * (i + 1) - (starty4 + (starty3 - starty4) / count * (i + 1) - starty1 - (starty2 - starty1) / count * (i + 1)) / count * (count - 1 - j),
                startz4 + (startz3 - startz4) / count * (i + 1) - (startz4 + (startz3 - startz4) / count * (i + 1) - startz1 - (startz2 - startz1) / count * (i + 1)) / count * (count - 1 - j)))
            hireacy.push(new Cesium.Cartesian3(startx4 + (startx3 - startx4) / count * i - (startx4 + (startx3 - startx4) / count * (i) - startx1 - (startx2 - startx1) / count * i) / count * (count - 1 - j),
                starty4 + (starty3 - starty4) / count * i - (starty4 + (starty3 - starty4) / count * (i) - starty1 - (starty2 - starty1) / count * i) / count * (count - 1 - j),
                startz4 + (startz3 - startz4) / count * i - (startz4 + (startz3 - startz4) / count * (i) - startz1 - (startz2 - startz1) / count * i) / count * (count - 1 - j)))
            hireacys.push(hireacy);
            //取出面的8个点坐标，拿点坐标去求高度值
            slopelineposition.push(Cesium.Cartographic.fromDegrees(hireacy[0].x, hireacy[0].y));
            slopelineposition.push(Cesium.Cartographic.fromDegrees((hireacy[0].x + hireacy[1].x) / 2, (hireacy[0].y + hireacy[1].y) / 2));
            slopelineposition.push(Cesium.Cartographic.fromDegrees(hireacy[1].x, hireacy[1].y));
            slopelineposition.push(Cesium.Cartographic.fromDegrees((hireacy[1].x + hireacy[2].x) / 2, (hireacy[1].y + hireacy[2].y) / 2));
            slopelineposition.push(Cesium.Cartographic.fromDegrees(hireacy[2].x, hireacy[2].y));
            slopelineposition.push(Cesium.Cartographic.fromDegrees((hireacy[2].x + hireacy[3].x) / 2, (hireacy[2].y + hireacy[3].y) / 2));
            slopelineposition.push(Cesium.Cartographic.fromDegrees(hireacy[3].x, hireacy[3].y));
            slopelineposition.push(Cesium.Cartographic.fromDegrees((hireacy[3].x + hireacy[0].x) / 2, (hireacy[3].y + hireacy[0].y) / 2));
        }
    }
    var terrainProvider=viewer.terrainProvider;
    var promise = Cesium.sampleTerrainMostDetailed(terrainProvider, slopelineposition);
    Cesium.when(promise,
        function (updatedPositions) {
            //拿到所有的高度数据
            var heighmm = [];
            var m = 0
            //计算坡度比的次数
            var countcolor1 = 0;
            var countcolor2 = 0;
            var countcolor3 = 0;
            var countcolor4 = 0;
            var countcolor5 = 0;
            var countcolor6 = 0;
            var countcolor7 = 0;
            for (var k = 0; k < updatedPositions.length / 8; k++) {
                //第一个点与第五个点的坡度
                var slope1 = (updatedPositions[m].height - updatedPositions[m + 4].height) / (Cesium.Cartesian3.distance(
                    Cesium.Cartesian3.fromDegrees(updatedPositions[m].latitude, updatedPositions[m].longitude, updatedPositions[m].height),
                    Cesium.Cartesian3.fromDegrees(updatedPositions[m + 4].latitude, updatedPositions[m + 4].longitude, updatedPositions[m + 4].height)))
                //第二个点与第六个点的坡度
                var slope2 = (updatedPositions[m + 1].height - updatedPositions[m + 5].height) / (Cesium.Cartesian3.distance(
                    Cesium.Cartesian3.fromDegrees(updatedPositions[m + 1].latitude, updatedPositions[m + 1].longitude, updatedPositions[m + 1].height),
                    Cesium.Cartesian3.fromDegrees(updatedPositions[m + 5].latitude, updatedPositions[m + 5].longitude, updatedPositions[m + 5].height)))
                //第三个点与第七个点的坡度
                var slope3 = (updatedPositions[m + 2].height - updatedPositions[m + 6].height) / (Cesium.Cartesian3.distance(
                    Cesium.Cartesian3.fromDegrees(updatedPositions[m + 2].latitude, updatedPositions[m + 2].longitude, updatedPositions[m + 2].height),
                    Cesium.Cartesian3.fromDegrees(updatedPositions[m + 6].latitude, updatedPositions[m + 6].longitude, updatedPositions[m + 6].height)))
                //第四个点与第八个点的坡度
                var slope4 = (updatedPositions[m + 3].height - updatedPositions[m + 7].height) / (Cesium.Cartesian3.distance(
                    Cesium.Cartesian3.fromDegrees(updatedPositions[m + 3].latitude, updatedPositions[m + 3].longitude, updatedPositions[m + 3].height),
                    Cesium.Cartesian3.fromDegrees(updatedPositions[m + 7].latitude, updatedPositions[m + 7].longitude, updatedPositions[m + 7].height)))
                // console.log("slope1:"+slope1+";slope2:"+slope2+";slope3:"+slope3+";slope4:"+slope4);
                var arrposition = [Math.abs(slope1), Math.abs(slope2), Math.abs(slope3), Math.abs(slope4)];//取绝对值
                arrposition.sort();
                var slope = arrposition[3]; // 拿到最大的坡度值  
                var lineposition = [];//画方向线的坐标
                if (slope == Math.abs(slope1)) {
                    if (slope1 > 0) {
                        lineposition.push(Cesium.Math.toDegrees(updatedPositions[m].longitude), Cesium.Math.toDegrees(updatedPositions[m].latitude),
                            Cesium.Math.toDegrees(updatedPositions[m + 4].longitude), Cesium.Math.toDegrees(updatedPositions[m + 4].latitude));
                    } else {
                        lineposition.push(
                            Cesium.Math.toDegrees(updatedPositions[m + 4].longitude), Cesium.Math.toDegrees(updatedPositions[m + 4].latitude),
                            Cesium.Math.toDegrees(updatedPositions[m].longitude), Cesium.Math.toDegrees(updatedPositions[m].latitude));

                    }
                } else if (slope == Math.abs(slope2)) {
                    if (slope2 > 0) {
                        lineposition.push(Cesium.Math.toDegrees(updatedPositions[m + 1].longitude), Cesium.Math.toDegrees(updatedPositions[m + 1].latitude),
                            Cesium.Math.toDegrees(updatedPositions[m + 5].longitude), Cesium.Math.toDegrees(updatedPositions[m + 5].latitude));
                    } else {
                        lineposition.push(
                            Cesium.Math.toDegrees(updatedPositions[m + 5].longitude), Cesium.Math.toDegrees(updatedPositions[m + 5].latitude),
                            Cesium.Math.toDegrees(updatedPositions[m + 1].longitude), Cesium.Math.toDegrees(updatedPositions[m + 1].latitude));
                    }
                } else if (slope == Math.abs(slope3)) {
                    if (slope3 > 0) {
                        lineposition.push(Cesium.Math.toDegrees(updatedPositions[m + 2].longitude), Cesium.Math.toDegrees(updatedPositions[m + 2].latitude),
                            Cesium.Math.toDegrees(updatedPositions[m + 6].longitude), Cesium.Math.toDegrees(updatedPositions[m + 6].latitude));
                    } else {
                        lineposition.push(
                            Cesium.Math.toDegrees(updatedPositions[m + 6].longitude), Cesium.Math.toDegrees(updatedPositions[m + 6].latitude),
                            Cesium.Math.toDegrees(updatedPositions[m + 2].longitude), Cesium.Math.toDegrees(updatedPositions[m + 2].latitude));
                    }
                } else if (slope == Math.abs(slope4)) {
                    if (slope4 > 0) {
                        lineposition.push(Cesium.Math.toDegrees(updatedPositions[m + 3].longitude), Cesium.Math.toDegrees(updatedPositions[m + 3].latitude),
                            Cesium.Math.toDegrees(updatedPositions[m + 7].longitude), Cesium.Math.toDegrees(updatedPositions[m + 7].latitude));
                    } else {
                        lineposition.push(
                            Cesium.Math.toDegrees(updatedPositions[m + 7].longitude), Cesium.Math.toDegrees(updatedPositions[m + 7].latitude),
                            Cesium.Math.toDegrees(updatedPositions[m + 3].longitude), Cesium.Math.toDegrees(updatedPositions[m + 3].latitude));
                    }
                }
                slope = (Math.abs(slope1) + Math.abs(slope2) + Math.abs(slope3) + Math.abs(slope4)) / 4; //四个坡度值大小有的差值特别大，这里取的平均值用来配置颜色
                // console.log(slope);
                if (0 <= slope && slope < 0.29) {
                    slopecolor = '#ff9090'
                    countcolor1++;
                } else if (0.29 <= slope && slope < 0.5) {
                    slopecolor = '#ff8080'
                    countcolor2++;
                } else if (0.5 <= slope && slope < Math.sqrt(2) / 2) {
                    slopecolor = '#ff7070'
                    countcolor3++;
                } else if (Math.sqrt(2) / 2 <= slope && slope < 0.87) {
                    slopecolor = '#ff6060'
                    countcolor4++;
                } else if (0.87 <= slope && slope < 0.91) {
                    slopecolor = '#ff5050'
                    countcolor5++;
                } else if (0.91 <= slope && slope < 0.95) {
                    slopecolor = '#ff4040'
                    countcolor6++;
                } else {
                    slopecolor = '#ff3030'
                    countcolor7++;
                }
                viewer.entities.add({
                    type: 'drawSloperectange',
                    rectangle: {
                        coordinates: Cesium.Rectangle.fromDegrees(
                            Cesium.Math.toDegrees(updatedPositions[m].longitude), Cesium.Math.toDegrees(updatedPositions[m].latitude),
                            Cesium.Math.toDegrees(updatedPositions[m + 4].longitude), Cesium.Math.toDegrees(updatedPositions[m + 4].latitude))
                        ,
                        material: Cesium.Color.fromCssColorString(slopecolor)

                    },
                    polyline: {
                        clampToGround: true,
                        positions: Cesium.Cartesian3.fromDegreesArray(lineposition),
                        material: new Cesium.PolylineArrowMaterialProperty(Cesium.Color.fromCssColorString("#ff9090")),// Cesium.Color.BLUE.withAlpha(0.5) ,
                        width: 8,
                        distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, updatedPositions[m + 4].height + 4500)
                    },
                }
                );
                m += 8;
            }
            //     var contents = "<div class='slope_layer'><div> <div style='height:19px;background-color:#ff9090; width: 64px;float: left;'> </div><span >" + (countcolor1 / (updatedPositions.length / 8) * 100).toFixed(2) + "% (<0.29)</span></div>";
            //     contents += " <div  style='clear: both;'><div style='height:19px;background-color:#ff8080 ; width: 64px;float: left;'></div><span >  " + (countcolor2 / (updatedPositions.length / 8) * 100).toFixed(2) + "%(<0.5)</span></div>";
            //     contents += "<div   style='clear: both;'><div  style='height:19px;background-color:#ff7070;width: 64px;float: left;'> </div><span >" + (countcolor3 / (updatedPositions.length / 8) * 100).toFixed(2) + "%(<0.7)</span></div>";
            //     contents += " <div  style='clear: both;'><div style='height:19px;background-color:#ff6060;width: 64px;float: left;'> </div><span >" + (countcolor4 / (updatedPositions.length / 8) * 100).toFixed(2) + "%(<0.87)</span></div>";
            //     contents += " <div  style='clear: both;'><div style='height:19px;background-color:#ff5050;width: 64px;float: left;'> </div><span > " + (countcolor5 / (updatedPositions.length / 8) * 100).toFixed(2) + "%(<0.91)</span></div>";
            //     contents += " <div  style='clear: both;'><div style='height:19px;background-color:#ff4040;width: 64px;float: left;'> </div><span >" + (countcolor6 / (updatedPositions.length / 8) * 100).toFixed(2) + "%(<0.95)</span></div>";
            //     contents += " <div  style='clear: both;'><div style='height:19px;background-color:#ff3030;width: 64px;float: left;'> </div><span > " + (countcolor7 / (updatedPositions.length / 8) * 100).toFixed(2) + "%(<1)</span></div></div>";
            //     layer.closeAll();
            //     layer.open({
            //         type: 1,
            //         offset: ["500px", "1200px"],
            //         area: ['260px', '179px'],
            //         title: "坡度分析信息"
            //         ,
            //         content: contents
            //         ,
            //         btnAlign: 'c' //按钮居中
            //         ,
            //         shade: 0 //不显示遮罩
            //         ,
            //         cancel: function (index) {
            //             layer.close(index);
            //         }
            //     });

        })
}