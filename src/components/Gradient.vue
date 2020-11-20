<template>
<div class="left">
    <el-button type="primary" @click="handclick" class="bar">选取坐标</el-button>
    <el-input-number v-model="cellside" :step="0.01" placeholder="单位间距" class="bar"></el-input-number>
    <el-button type="primary" @click="calculate" class="bar">计算</el-button>
    <el-button type="primary" @click="createMaterial" class="bar">canvas添加至entity</el-button>
    <el-button type="primary" @click="generate" class="bar">生成图片</el-button>
    <el-button type="primary" @click="clear" class="bar">清空</el-button>
</div>
</template>

<script>
import { degreesToRadians } from '@turf/turf';
const Cesium = require("cesium/Cesium");
import texture from '../js/texture'
export default {
    name: "Gradient",
    props: ["_viewer"],
    data() {
        return {
            positions: [],
            cellside: 0.05,
            gradients: [],
            directions: [],
            originGradients: []
        };
    },
    methods: {
        clear() {
            let viewer = this._viewer;
            this.positions = [];
            this.gradients = [];
            this.directions = [];
            this.originGradients = []
            viewer.entities.removeAll();
        },
        calculate() {
            // this.positions.map((position)=>{
            //       var cartographic =Cesium.Cartographic.fromCartesian(position);
            //       return [Cesium.Math.toDegrees(cartographic)]
            //   })
            // this._screenHandler.removeInputAction(
            //     Cesium.ScreenSpaceEventType.LEFT_CLICK
            // );
            this.drawSlopePolygon(...this.positions);
        },
        handclick() {
            let viewer = this._viewer;

            viewer.scene.globe.depthTestAgainstTerrain = true
            // viewer.camera.setView({
            //     destination: new Cesium.Cartesian3(
            //         581273.1305004816,
            //         5837234.507446994,
            //         2501384.40864157
            //     ),
            // });
            let instance = this;
            var screenHandler = new Cesium.ScreenSpaceEventHandler();
            var points = new Cesium.PointPrimitiveCollection();
            viewer.scene.primitives.add(points);
            this._screenHandler = screenHandler;
            screenHandler.setInputAction(function (e) {
                var pick = viewer.scene.pick(e.position);
                if (Cesium.defined(pick)) {
                    console.log("slopeDegrees", pick.primitive.id)
                } else {
                    var earthPosition = viewer.scene.pickPosition(e.position);
                    var cartographic = Cesium.Cartographic.fromCartesian(earthPosition);
                    var longitude = Cesium.Math.toDegrees(cartographic.longitude);
                    var latitude = Cesium.Math.toDegrees(cartographic.latitude);
                    instance.positions.push([longitude, latitude]);
                    points.add({
                        position: earthPosition,
                        color: Cesium.Color.YELLOW,
                    });
                }
            }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
        },
        //绘制小矩形面 四个经纬度的点，z值高度可以忽略 如：113.xx  ,37.xx,0 ,113.xx,37.xx,0
        drawSlopePolygon(position1, position2, position3, position4) {
            const instance = this;
            var polygon = turf.polygon([
                [position1, position2, position3, position4, position1],
            ]);
            var bbox = turf.bbox(polygon);
            instance.positions = turf.getCoords(polygon)
            var cellSide = this.cellside;
            var gridCell = Math.sqrt(cellSide * 1000);
            var options = { units: "kilometers" };
            var squareGrids = turf.squareGrid(bbox, cellSide, options);
            var positions = [];
            squareGrids.features.map((grid) => {
                // viewer.entities.add({
                //     polygon: {
                //         hierarchy: {
                //             positions: turf.getCoords(grid)[0].map((lonlat) => {
                //                 return Cesium.Cartesian3.fromDegrees(lonlat[0], lonlat[1])
                //             }),
                //         },
                //         material: Cesium.Color.fromRandom().withAlpha(0.5)
                //     }
                // })
                var comparePositions = [];
                //由于矩形，存在首尾相同点
                var temp = turf.getCoords(grid);
                var vertexs = temp[0];
                vertexs.pop();
                vertexs.map((vertex, index) => {
                    var point1 = turf.point(vertex);
                    var point2;
                    if (index + 1 < vertexs.length) {
                        point2 = turf.point(vertexs[index + 1]);
                    } else {
                        point2 = turf.point(vertexs[0]);
                    }
                    var midpoint = turf.midpoint(point1, point2);
                    let coor = turf.getCoord(midpoint);
                    let carto = Cesium.Cartographic.fromDegrees(coor[0], coor[1]);
                    //四个边中心点
                    comparePositions.push(carto);
                    coor = turf.getCoord(vertex);
                    //四边顶点
                    carto = Cesium.Cartographic.fromDegrees(coor[0], coor[1]);
                    comparePositions.push(carto);
                });
                //单个格子中心点
                var center = turf.center(grid);
                let coor = turf.getCoord(center);
                let carto = Cesium.Cartographic.fromDegrees(coor[0], coor[1]);
                comparePositions.push(carto);
                positions.push(...comparePositions);
            });
            var terrainProvider = viewer.terrainProvider;
            //positions必须是Cartographic类型
            var promise = Cesium.sampleTerrainMostDetailed(
                terrainProvider,
                positions
            );
            var directions = [];
            var gradients = [];
            var points = viewer.scene.primitives.add(
                new Cesium.PointPrimitiveCollection()
            );
            Cesium.when(promise, function (updatedPositions) {
                for (let i = 0; i < updatedPositions.length; i += 9) {
                    let center = updatedPositions[i + 8];
                    var maxGradient = 0;
                    var direction;
                    //Horn算法
                    let westNorthHeight = updatedPositions[i + 0].height;
                    let northHeight = updatedPositions[i + 1].height;
                    let eastNorthHeight = updatedPositions[i + 2].height;
                    let eastHeight = updatedPositions[i + 3].height;

                    let eastSouthHeight = updatedPositions[i + 4].height;
                    let southHeight = updatedPositions[i + 5].height;
                    let westSouthHeight = updatedPositions[i + 6].height;
                    let westHeight = updatedPositions[i + 7].height;

                    //calculate slope using its 8 neighbors
                    var dzdx = (((eastNorthHeight + (2 * eastHeight) + eastSouthHeight)) - ((westNorthHeight + (2 * westHeight) + westSouthHeight))) / (8 * gridCell);
                    var dzdy = (((westSouthHeight + (2 * southHeight) + eastSouthHeight)) - ((westNorthHeight + (2 * northHeight) + eastNorthHeight))) / (8 * gridCell);
                    var riseRun = Math.sqrt(Math.pow(dzdx, 2) + Math.pow(dzdy, 2));
                    console.log("riseRun", riseRun)
                    var slopeDegrees = Math.atan(riseRun) * (180 / Math.PI);
                    console.log("slopeDegrees", slopeDegrees)
                    let north = (westNorthHeight + 2 * northHeight + eastNorthHeight);
                    let south = (westSouthHeight + 2 * southHeight + eastSouthHeight);
                    let east = (eastNorthHeight + 2 * eastHeight + eastSouthHeight);
                    let west = (westNorthHeight * +westHeight * 2 + westSouthHeight)
                    let slopeDirection = Math.atan((south - north) / (west - east));
                    //   slopeDirection = slopeDirection < 0 ? slopeDirection + Cesium.Math.PI : slopeDirection
                    slopeDirection = Cesium.Math.toDegrees(slopeDirection)
                    console.log("slopeDirection", slopeDirection)
                    // var point = turf.point([Cesium.Math.toDegrees(center.longitude), Cesium.Math.toDegrees(center.latitude)]);
                    // var distance = cellSide;
                    // var bearing = slopeDirection;
                    // var options = { units: 'kilometers' };
                    // var destination = turf.destination(point, distance, bearing, options);
                    // let result = turf.getCoord(destination)
                    // var carto = Cesium.Cartographic.fromDegrees(result[0], result[1]);
                    // viewer.entities.add({
                    //     polyline: {
                    //         clampToGround: true,
                    //         positions: [Cesium.Cartesian3.fromRadians(center.longitude, center.latitude, center.height),
                    //             Cesium.Cartesian3.fromRadians(carto.longitude, carto.latitude, carto.height)
                    //         ],
                    //         width: 20,
                    //         material: new Cesium.PolylineArrowMaterialProperty(
                    //             Cesium.Color.BLUE
                    //         ),
                    //     }
                    // })
                    gradients.push(riseRun);
                    //----

                    var array = []
                    for (let j = i; j < i + 8; j++) {
                        let gradient =
                            (center.height - updatedPositions[j].height) /
                            Cesium.Cartesian3.distance(
                                Cesium.Cartesian3.fromRadians(
                                    center.longitude,
                                    center.latitude
                                ),
                                Cesium.Cartesian3.fromRadians(
                                    updatedPositions[j].longitude,
                                    updatedPositions[j].latitude
                                )
                            );
                        instance.originGradients.push(gradient)
                        if (gradient > maxGradient) {
                            maxGradient = gradient;
                            direction = updatedPositions[j];
                            //bitmap[j] = maxGradient;
                        }
                        array.push(updatedPositions[j])
                    }
                    // var color;
                    // var slope = maxGradient
                    // let slopecolor;
                    // if (0 <= slope && slope < 0.29) {
                    //     slopecolor = "#F0F8FF";
                    // } else if (0.29 <= slope && slope < 0.5) {
                    //     slopecolor = "#4169E1";
                    // } else if (0.5 <= slope && slope < Math.sqrt(2) / 2) {
                    //     slopecolor = "#EEE8AA";
                    // } else if (Math.sqrt(2) / 2 <= slope && slope < 0.87) {
                    //     slopecolor = "#FFFF00";
                    // } else if (0.87 <= slope && slope < 0.91) {
                    //     slopecolor = "#EE82EE";
                    // } else if (0.91 <= slope && slope < 0.95) {
                    //     slopecolor = "#FF1493";
                    // } else {
                    //     slopecolor = "#DC143C";
                    // }
                    // viewer.entities.add({
                    //     polygon: {
                    //         hierarchy: {
                    //             positions: array.map((lonlat) => {
                    //                 return Cesium.Cartesian3.fromRadians(lonlat.longitude, lonlat.latitude, lonlat.height)
                    //             }),
                    //         },
                    //         material: Cesium.Color.fromCssColorString(slopecolor)
                    //     }
                    // })
                    directions.push(direction);
                    gradients.push(maxGradient);
                    console.log("maxGradient", maxGradient);
                    var point = points.add(
                        new Cesium.PointPrimitive({
                            position: Cesium.Cartesian3.fromRadians(
                                center.longitude,
                                center.latitude,
                                center.height
                            ),
                            id: slopeDegrees + "__" + Cesium.Math.toDegrees(maxGradient),
                            color: Cesium.Color.RED,
                        })
                    );
                    // viewer.entities.add({
                    //     polyline: {
                    //         clampToGround: true,
                    //         positions: [
                    //             Cesium.Cartesian3.fromRadians(
                    //                 center.longitude,
                    //                 center.latitude,
                    //                 center.height
                    //             ),
                    //             Cesium.Cartesian3.fromRadians(
                    //                 direction.longitude,
                    //                 direction.latitude,
                    //                 direction.height
                    //             ),
                    //         ],
                    //         width: 20,
                    //         material: new Cesium.PolylineArrowMaterialProperty(
                    //             Cesium.Color.GREEN
                    //         ),
                    //     },
                    // });
                }
                console.log("结束");
                instance.gradients = gradients;
                instance.directions = directions;
            });
        },
        //转canvas，类比terrainRgb
        toCanvas() {
            const gradients = this.gradients;
            //计算画布的大小
            var w = Math.floor(Math.sqrt(gradients.length));
            var h = w;
            var canvas = document.createElement("canvas");
            canvas.height = h;
            canvas.width = w;
            var ctx = canvas.getContext("2d");
            var bitmap = new Uint8ClampedArray(w * h * 4);
            //extract elevations
            for (var y = 0; y < h; y++) {
                for (var x = 0; x < w; x++) {
                    var slope = gradients[y * w + x];
                    let slopecolor;
                    if (0 <= slope && slope < 0.29) {
                        slopecolor = "#FFF5EE";
                    } else if (0.29 <= slope && slope < 0.5) {
                        slopecolor = "#FFF5EE";
                    } else if (0.5 <= slope && slope < Math.sqrt(2) / 2) {
                        slopecolor = "#FFF5EE";
                    } else if (Math.sqrt(2) / 2 <= slope && slope < 0.87) {
                        slopecolor = "#FFF5EE";
                    } else if (0.87 <= slope && slope < 0.91) {
                        slopecolor = "#DC143C";
                    } else if (0.91 <= slope && slope < 0.95) {
                        slopecolor = "#DC143C";
                    } else {
                        slopecolor = "#DC143C";
                    }
                    var height = 0
                    //    var height = this.directions[y * w + x].height
                    var rgbaArray = this.sixTeenToRgba(slopecolor, height);
                    var bitmapIndex = y * w * 4 + x * 4
                    bitmap[bitmapIndex + 0] = rgbaArray[0]
                    bitmap[bitmapIndex + 1] = rgbaArray[1]
                    bitmap[bitmapIndex + 2] = rgbaArray[2]
                    bitmap[bitmapIndex + 3] = rgbaArray[3]
                    //      bitmap.join(rgbaArray);
                }
            };
            let imageData = new ImageData(bitmap, w, h);
            ctx.putImageData(imageData, 0, 0);
            return canvas;
        },
        sixTeenToRgba(value, height) {
            var string = value.split("#");
            let r = parseInt(string[1].substring(0, 2), 16);
            let g = parseInt(string[1].substring(2, 4), 16);
            let b = parseInt(string[1].substring(4, 6), 16);
            let a = Math.floor(height / 1000 * 255)
            a = a < 0 ? 0 : a;
            a = 255
            return [r, g, b, a]
        },
        generate() {
            let canvas = this.toCanvas();
            canvas.className = "imgSlope"
            document.body.appendChild(canvas)
        },
        createMaterial() {
            let canvas = this.toCanvas();
            //  let ctx= canvas.getContext('2d')
            //   ctx.rotate(Math.PI/2);
            let viewer = this._viewer;
            let positions = this.positions[0].map((position) => Cesium.Cartesian3.fromDegrees(position[0], position[1]));
            positions.pop();
            var polygon = viewer.entities.add({
                polygon: {
                    hierarchy: new Cesium.PolygonHierarchy(positions),
                    material: new Cesium.ImageMaterialProperty({
                        image: canvas,
                        // color: Cesium.Color.BLUE,
                        //  repeat: new Cesium.Cartesian2(4, 4)
                    }),
                    classificationType: Cesium.ClassificationType.BOTH,
                },
            });
        }
    },
    mounted() {
        var viewer = window.viewer;
    },
};
</script>

<style scoped>
.left {
    position: fixed;
    left: 0;
    top: 10px;
    width: 200px;
    /* height: 500px; */
    color: white;
    z-index: 10;
    border: turquoise 1px solid;
}

.bar {
    width: 150px;
    margin: 10px 10px 10px 10px;
    ;
}
</style><style>
.imgSlope {
    position: fixed;
    right: 50%;
    top: 10px;
    color: white;
    z-index: 10;
    border: turquoise 1px solid;
}
</style>
