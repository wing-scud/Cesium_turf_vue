// //This file is automatically rebuilt by the Cesium build process.
// export default "czm_material czm_getMaterial(czm_materialInput materialInput)\n\ {\n\
//     czm_material material = czm_getDefaultMaterial(materialInput);\n\
//     vec2 st = materialInput.st;\n\
//     vec4 colorImage = texture2D(image, vec2(fract((st.t - time)), st.t));\n\
//     vec4 fragColor;\n\
//     fragColor.rgb = (colorImage.rgb+color.rgb) / 1.0;\n\
//     fragColor = czm_gammaCorrect(fragColor);\n\
//     material.alpha = colorImage.a * color.a;\n\
//     material.diffuse = (colorImage.rgb+color.rgb)/2.0;\n\
//     material.emission = fragColor.rgb;\n\
//     return material;\n\
