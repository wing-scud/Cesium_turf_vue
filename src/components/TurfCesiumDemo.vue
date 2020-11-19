<template>
<div>
    <div class="navigator">
        <el-menu default-active="2" class="el-menu-vertical-demo" background-color="#ffffff" @select="selectOptions">
            <el-submenu index="1">
                <template slot="title">
                    <i class="el-icon-location"></i>
                    <span>测量</span>
                </template>
                <el-submenu index="1-1">
                    <template slot="title">测量</template>
                    <el-menu-item index="1-1-1">测量沿线固定距离的点</el-menu-item>
                    <el-menu-item index="1-1-2">测量多边形面积</el-menu-item>
                    <el-menu-item index="1-1-3">测量二点之间角度(以N为0度)</el-menu-item>
                    <el-menu-item index="1-1-4">由初始位置根据距离和方向得到位置</el-menu-item>
                    <el-menu-item index="1-1-5">测量二点之间距离</el-menu-item>
                </el-submenu>
            </el-submenu>
        </el-menu>
    </div>
    <div class="panel"><el-input-number :value="showMessage" :min="0" :max="10" v-model="message" @change="setMessage" label="描述文字"></el-input-number></div>
</div>
</template>

<script>
//const Cesium = require('cesium/Cesium')
import {
    measureLong,
    measureArea,
    getAngelBetweenPoints,
    getDestination,
    measureDistance
} from "../class/turf";
export default {
    name: 'TurfCesiumDemo',
    data() {
        return {
            viewer: "",
            message:"hello"
        }
    },
    mounted() {
        // var viewer = new Cesium.Viewer("cesiumContainer", {
        //     animation: false, //隐藏时钟
        //     homeButton: false,
        //     fullscreenButton: false,
        //     geocoder: false, //隐藏搜索
        //     sceneModePicker: false, // 隐藏二三维切换
        //     baseLayerPicker: false, //隐藏图层管理
        //     timeline: false,
        //     infoBox: false, // 隐藏点击entity信息框
        //     navigationHelpButton: false, //隐藏帮助按钮
        //     selectionIndicator: false // 隐藏点击entity绿框
        // })
        // document.getElementsByClassName("cesium-widget-credits").item(0).style.display = "none";
        // this.viewer = viewer;
    },
    methods: {
        selectOptions(index) {
            switch (index) {
                case "1-1-1":
                    this.tMeasureLong();
                    break;
                case "1-1-2":
                    this.tmeasureArea();
                    break;
                case "1-1-3":
                    this.tGetAngelBetweenPoints();
                    break;
                case "1-1-4":
                    this.tGetDestination();
                    break;
                case "1-1-5":
                    this.tMeasureDistance();
                    break;
                default:
                    break;
            }
        },
        tMeasureLong() {
            var viewer = this.viewer;
            var geometry = new Cesium.PolylineGeometry({
                positions: Cesium.Cartesian3.fromDegreesArray([-83, 30, -84, 36, -78, 41]),
                width: 5,
            })
            var geometryInstance = new Cesium.GeometryInstance({
                geometry: geometry,
                attributes: {
                    color: Cesium.ColorGeometryInstanceAttribute.fromColor(Cesium.Color.RED)
                },
            });
            var primitive = new Cesium.Primitive({
                geometryInstances: geometryInstance,
                appearance: new Cesium.PolylineColorAppearance({
                    translucent: false
                })
            })
            var line = viewer.scene.primitives.add(primitive);
            var long = 200;
            var point = measureLong(line, long);
            var coordinates = point.geometry.coordinates;
            var points = viewer.scene.primitives.add(new Cesium.PointPrimitiveCollection());
            var position = Cesium.Cartesian3.fromDegrees(coordinates[0], coordinates[1], 0);
            points.add({
                position: position,
                color: Cesium.Color.WHITE
            })
            this.showInformation("沿线" + long + "km长的点", position)
        },
        tmeasureArea() {
            var viewer = this.viewer;
            var geometry = new Cesium.PolygonGeometry({
                polygonHierarchy: new Cesium.PolygonHierarchy(
                    Cesium.Cartesian3.fromDegreesArray([
                        125, -15, 113, -22, 154, -27, 144, -15, 125, -15
                    ])
                ),
            });
            var geometryInstance = new Cesium.GeometryInstance({
                geometry: geometry,
                attributes: {
                    color: new Cesium.ColorGeometryInstanceAttribute(0.0, 1.0, 1.0, 0.5)
                }
            });
            var primitive = new Cesium.Primitive({
                geometryInstances: geometryInstance,
                appearance: new Cesium.PerInstanceColorAppearance({
                    flat: true,
                    renderState: {
                        lineWidth: Math.min(2.0, viewer.scene.maximumAliasedLineWidth),
                    },
                }),
            })
            var polygon = viewer.scene.primitives.add(primitive);
            var area = measureArea(polygon) / 1000000;
            area = area.toFixed(2)
            var position = Cesium.Cartesian3.fromDegrees(125, -15);
            this.showInformation("多边形面积为" + area + "平方千米", position);
        },
        tGetAngelBetweenPoints() {
            var viewer = this.viewer;
            var points = viewer.scene.primitives.add(new Cesium.PointPrimitiveCollection());
            var position1 = Cesium.Cartesian3.fromDegrees(-75.343, 39.984);
            var position2 = Cesium.Cartesian3.fromDegrees(-75.534, 39.123);
            var point1 = points.add({
                position: position1,
                color: Cesium.Color.BLUE
            })
            var point2 = points.add({
                position: position2,
                color: Cesium.Color.RED
            });
            var position = Cesium.Cartesian3.midpoint(position1, position2, new Cesium.Cartesian3())
            var angel = getAngelBetweenPoints(point1, point2);
            this.showInformation("红点位于蓝点" + angel + "角度", position)
        },
        tGetDestination() {
            var viewer=this.viewer;
            var start = [-75.343, 39.984];
            var position = Cesium.Cartesian3.fromDegrees(start[0], start[1]);
            var points = viewer.scene.primitives.add(new Cesium.PointPrimitiveCollection());
            var point1 = points.add({
                position: position,
                color: Cesium.Color.WHITE
            })
            var distance=50;
            var angel=60;
            var point = getDestination(start,distance,angel);
            var coordinate = point.geometry.coordinates;
            var position1 = Cesium.Cartesian3.fromDegrees(coordinate[0], coordinate[1]);
            var point2 = points.add({
                position: position1,
                color: Cesium.Color.BLUE
            })
             this.showInformation("白点60方向上50km的蓝点位置", position1)
        },
        tMeasureDistance(){
            var viewer=this.viewer;
            var points=viewer.scene.primitives.add(new Cesium.PointPrimitiveCollection());
            var position1=Cesium.Cartesian3.fromDegrees(-75.343, 39.984);
            var position2=Cesium.Cartesian3.fromDegrees(-75.534, 39.123)
            var point1=points.add({
                position:position1,
                color:Cesium.Color.RED
            })
            var point2=points.add({
                position:position2,
                 color:Cesium.Color.BLUE
            })
            var distancee=measureDistance(point1,point2);
            var position=Cesium.Cartesian3.midpoint(position1,position2,new Cesium.Cartesian3());
            this.showInformation("二点之间距离为"+distance+"m",position);
        },
        showInformation(text, position) {
            var viewer = this.viewer;
            var labels = viewer.scene.primitives.add(new Cesium.LabelCollection());
            var label = labels.add({
                text: text,
                font: "30px",
                position: position,
                fillColor: Cesium.Color.WHITE,
                pixelOffset: new Cesium.Cartesian2(20, 20),
                distanceDisplayByCondition:new Cesium.DistanceDisplayCondition(0,5e6)
            })
        },
        setMessage(value){
            this.message=value;
        }
    },
    computed:{
        showMessage:function(){
            return this.message+100
        }
    }
}
</script>

<style>
@import "cesium/Source/Widgets/widgets.css";

.navigator {
    width: 300px;
    height: 100%;
    top: 0;
    left: 0;
    position: absolute;
    z-index: 1000
}
.panel {
    width:200px;
    height:300px;
    position: absolute;
    z-index: 1000;
    display: flex;
    top:10px;
    right:200px;
    flex-direction: column;
}
.row {
    width:100%;
    height: 30px;
    margin:10px 0 5px 0;
}
</style>
