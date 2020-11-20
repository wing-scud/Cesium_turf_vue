export default class Gradient {
    constructor(earth, drawerHelper) {
        this._earth = earth;
    }
    pickArea() {
        var earth = this._earth;
        //pick event
        //得到矩形四个顶点
        this._originPositions = []
    }
    //获取分割后的单元格
    splitCeil() {
        //根据边长计算单元格大小
        this._ceilSide = 0;
        return ceils;
    }
    //获取相邻的八个方向坐标和中心坐标
    getNearPoistion(ceil) {
        let nearPositions;
        let center;
        return [nearPositions, center];
    }
    //return degrees
    calculateSlope(center, nearPositions) {
        let slope = 0;
        return slope;
    }
    //生成canvas,灰度图
    toCanvas(slopeArray) {
        //计算canvas长宽=》二维上经纬度除以ceilSide
        let width;
        let height;
        let bitmap;
        for (let i = 0; i < width; i++) {
            for (let j = 0; j < height; j++) {
                bitmap[i * height + j] = slopeArray[i * height + j]
            }
        }
        //将bitmap给imageData
        let imageData = new ImageData();
        //new canvas
        let canvas = document.createElement('canvas')
        let ctx = canvas.getContext('2d');
        ctx.putImageData(imageData);
        this._canvas = canvas;
        //return canvas;
    }
    //params:ceilSide,slopeCanvas,
    createMaterial() {
        //创建着色器
        //将灰度图单位值取出，根据值转为rgb
        let material;
        return material;
    }
    //Diff:如何对齐
    canvasToTerrain() {
        //创建primitive
        //使用创建的material
        //添加到地形上覆盖
    }
}