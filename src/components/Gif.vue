<template>
<div>
    <img id="gif" src="../assets/q.gif" />
    <!-- <img id="gif2" src="../assets/logo.png" rel:animated_src="../assets/q.gif" rel:auto_play="0" width="100" height="200"> -->
    <img id="gif3" src="../assets/q.gif" rel:auto_play="0" width="20" height="20" rel:rubbable="0" />
</div>
</template>

<script>
const Cesium = require('cesium/Cesium');
window.Cesium = Cesium
import BillboardAnimator from './BillboardAnimator'
export default {
    name: "GifDemp",
    data() {
        return {

        }
    },
    mounted() {
        for (let i = 0; i < 100; i++) {
            var lon = Math.random() * 360;
            var lat = Math.random() * 80;
            var alt = 100;
            var lonlat = [lon, lat, alt];
            // this.createGif1(i, lonlat);
            this.createGif2(i, lonlat);
        }
        // this.createGif1();
        //  this.createGif2();
        //  this.createGif3();
    },
    methods: {
        createGif1(i, lonlat) {
            var viewer = window.viewer;
            var img = document.createElement("img");
            img.src = "static/image/q.gif";
            //     var htmlOverlay = document.getElementById("gif");
            img.className = "gif"
            document.body.appendChild(img)
            var scratch = new Cesium.Cartesian2();
            viewer.scene.preRender.addEventListener(function () {
                var position = Cesium.Cartesian3.fromDegrees(lonlat[0], lonlat[1], lonlat[2]);
                var canvasPosition = viewer.scene.cartesianToCanvasCoordinates(position, scratch);
                if (Cesium.defined(canvasPosition)) {
                    img.style.top = canvasPosition.y + "px";
                    img.style.left = canvasPosition.x + "px";
                }
            });
        },
        createGif2(id, lonlat) {
            var viewer = window.viewer
            var billboards = viewer.scene.primitives.add(new Cesium.BillboardCollection());
            var billboard = billboards.add({
                //   image: "static/image/1.jpg",
                position: Cesium.Cartesian3.fromDegrees(lonlat[0], lonlat[1], lonlat[2]),
                width: 80,
                height: 80,
            });
            var img = document.createElement("img");
            img.src = "static/image/q.gif";
            //     var htmlOverlay = document.getElementById("gif");
            img.className = "gif";
            img.id = id;
            document.body.appendChild(img)
            var i = 1;
            var sup2 = new RubbableGif({
                gif: document.getElementById(id),
                auto_play: false
            });
            var gifVue = this;
            var images = [0];
            var first = true
            sup2.load(function () {
                requestAnimationFrame(function updateCanvas() {
                    //   debugger
                    if (i > sup2.get_length()) {
                        if (first) {
                            first = false;
                            var node = images[1].parentNode
                            document.body.removeChild(node)
                        }
                        i = 1;
                    }
                    var canvas;
                    if (first) {
                        canvas = sup2.get_canvas();
                        images.push(canvas);
                    } else {
                        canvas = images[i];
                    }
                    billboard.setImage(i.toString(), canvas);
                    sup2.move_to(i);
                    i++;
                    setTimeout(() => {
                        requestAnimationFrame(updateCanvas)
                    }, 50);
                })
            });
        },
        createGif3() {
            var gifs = [
                new BillboardAnimator.fromGif({
                    url: '../assets/cheer.gif'
                }),
                new BillboardAnimator.fromGif({
                    url: '../assets/cheer.gif'
                }),
                new BillboardAnimator.fromGif({
                    url: '../assets/cheer.gif'
                })
            ];
            Cesium.when.all(gifs, function (values) {
                viewer.entities.add({
                    position: Cesium.Cartesian3.fromDegrees(-75.59777, 40.03883),
                    billboard: {
                        image: values[0].image,
                        imageSubRegion: values[0].imageSubRegion,
                        scale: 0.25
                    }
                });
                viewer.entities.add({
                    position: Cesium.Cartesian3.fromDegrees(-75.59777, 41.03883),
                    billboard: {
                        image: values[1].image,
                        imageSubRegion: values[1].imageSubRegion,
                        scale: 0.25
                    }
                });
                viewer.entities.add({
                    position: Cesium.Cartesian3.fromDegrees(-73.59777, 40.03883),
                    billboard: {
                        image: values[2].image,
                        imageSubRegion: values[2].imageSubRegion,
                        scale: 0.25
                    }
                });
                viewer.zoomTo(viewer.entities);
            })
        },
    }
}
</script>

<style>
#gif,
#gif2,
#gif3 {
    position: fixed;
    width: 80px;
    height: 80px;
    z-index: 2;
    /* visibility: hidden; */
}

.jsgif {
    display: none;
}

.gif {
    position: fixed;
    width: 80px;
    height: 80px;
    z-index: 2;
    /* visibility: hidden; */
}
</style>
