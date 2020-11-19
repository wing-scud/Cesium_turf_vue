<template>
<div id="cesiumContainer">
    <component :is="demo" v-if="ready" :_viewer="_viewer"></component>
    <!-- <TurfCesiumDemo></TurfCesiumDemo> -->
</div>
</template>

<script>
const Cesium = require("cesium/Cesium");
import TurfCesiumDemo from "./TurfCesiumDemo";
import GifDemo from "./Gif";
import Gradient from "./Gradient";
export default {
    name: "HelloWorld",
    components: {
        TurfCesiumDemo,
        "gif-demo": GifDemo,
        Gradient,
    },
    data() {
        return {
            demo: "Gradient",
            ready: false,
        };
    },
    mounted() {
        this.initViewer();
    },
    methods: {
        initViewer() {
            Cesium.Ion.defaultAccessToken =
                "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJkMGUzMGM5OS1lNmRiLTQyYWEtYThlNy0wMzYxNDJhOTM1YzMiLCJpZCI6MTcyMDAsInNjb3BlcyI6WyJhc2wiLCJhc3IiLCJhc3ciLCJnYyJdLCJpYXQiOjE1OTM2NTQ5MDV9.2aIpnr5UbOznMgMGffRcjy5ld0Hb31g50FwF9ncuM38";
            var viewer = new Cesium.Viewer("cesiumContainer", {
                terrainProvider: new Cesium.CesiumTerrainProvider({
                    url: Cesium.IonResource.fromAssetId(1),
                }),
            });
            var imageryLayer = viewer.imageryLayers.addImageryProvider(
                new Cesium.IonImageryProvider({ assetId: 2 })
            );
            viewer.zoomTo(imageryLayer).otherwise(function (error) {
                console.log(error);
            });
            document
                .getElementsByClassName("cesium-widget-credits")
                .item(0).style.display = "none";
            this._viewer = viewer;
            window.viewer = viewer;
            this.onReady();
        },
        onReady() {
            this.ready = true;
        },
    },
};
</script>

<style>
html,
body,
#cesiumContainer {
    width: 100%;
    height: 100%;
    margin: 0;
}
</style>
