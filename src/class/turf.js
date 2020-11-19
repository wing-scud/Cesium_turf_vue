/**
 * turf库的接入，基础分析功能集成
 */
import * as turf from '@turf/turf'
var Cesium = require('cesium/Cesium');

function measureLong(cesiumLine, long) {
    var geometry = cesiumLine.geometryInstances.geometry;
    var coordidates = geometry._positions;
    var turfArray = [];
    for (let i = 0; i < coordidates.length; i++) {
        var radians = Cesium.Cartographic.fromCartesian(coordidates[i]);
        var lat = Cesium.Math.toDegrees(radians.latitude)
        var lng = Cesium.Math.toDegrees(radians.longitude)
        turfArray.push([lng, lat]);
    }
    var line = turf.lineString(turfArray);
    var options = { units: 'kilometers' };
    var point = turf.along(line, long, options);
    return point;
}

function measureArea(polygon) {
    var turfArray = [];
    var geometry = polygon.geometryInstances.geometry;
    var coordidates = geometry._polygonHierarchy.positions;
    for (let i = 0; i < coordidates.length; i++) {
        var radians = Cesium.Cartographic.fromCartesian(coordidates[i]);
        var lat = Cesium.Math.toDegrees(radians.latitude)
        var lng = Cesium.Math.toDegrees(radians.longitude)
        turfArray.push([lng, lat]);
    }
    var tPolygon = turf.polygon([turfArray]);
    var area = turf.area(tPolygon);
    return area;
}

function getAngelBetweenPoints(point1, point2) {
    var coordidate1 = point1.position;
    var coordidate2 = point2.position;
    var radians = Cesium.Cartographic.fromCartesian(coordidate1);
    var lat = Cesium.Math.toDegrees(radians.latitude)
    var lng = Cesium.Math.toDegrees(radians.longitude)
    var tPoint1 = turf.point([lng, lat]);
    radians = Cesium.Cartographic.fromCartesian(coordidate2);
    lat = Cesium.Math.toDegrees(radians.latitude)
    lng = Cesium.Math.toDegrees(radians.longitude)
    var tPoint2 = turf.point([lng, lat]);
    var bearing = turf.bearing(tPoint1, tPoint2);
    return bearing;
}

/**
 * bbox，返回，边界框
 * center，任意的一组对象，返回中心点
 * 质心，重心，绝对中心
 * envelope返回包括所有特征的矩形
 */

function getDestination(start, distance, bearing) {
    var point = turf.point(start);
    var options = { units: 'kilometers' };
    var destination = turf.destination(point, distance, bearing, options);
    return destination;
}

function measureDistance(point1, point2) {
    var start = point1.position;
    var end = point2.position;
    var radians = Cesium.Cartographic.fromCartesian(start);
    var lat = Cesium.Math.toDegrees(radians.latitude)
    var lng = Cesium.Math.toDegrees(radians.longitude)
    var tPoint1 = turf.point([lng, lat]);
    radians = Cesium.Cartographic.fromCartesian(end);
    lat = Cesium.Math.toDegrees(radians.latitude)
    lng = Cesium.Math.toDegrees(radians.longitude)
    var tPoint2 = turf.point([lng, lat]);
    var options = { units: 'miles' };
    var distance = turf.distance(tPoint1, tPoint2, options);
    return distance;
}
//不只是包括点
// function envelopeRectangle(array){
//     var features = turf.featureCollection([
//         turf.point([-75.343, 39.984], {"name": "Location A"}),
//         turf.point([-75.833, 39.284], {"name": "Location B"}),
//         turf.point([-75.534, 39.123], {"name": "Location C"})
//       ]);
//       var enveloped = turf.envelope(features);
// }

function getLength(line){
    var line = turf.lineString([[115, -32], [131, -22], [143, -25], [150, -34]]);
    var length = turf.length(line, {units: 'miles'});
}
export {
    measureLong,
    measureArea,
    getAngelBetweenPoints,
    getDestination,
    measureDistance
}
/**
 * 方法集合
 * 调用 返回值或者直接控制
 * 功能：
 */