const devicePixelRatioToUse = 1.0;

window.context = new GLOW.Context({
	clear: {red: 0.4, green: 0.4, blue: 0.4},
	preserveDrawingBuffer: true,
	width: window.innerWidth * devicePixelRatioToUse,
	height: window.innerHeight * devicePixelRatioToUse
});

if(!context.enableExtension( "OES_texture_float" )) {
	alert("No support for float textures!");
}

if( !context.enableExtension( "OES_texture_float_linear" )) {
	alert("No support for float texture linear interpolation!");
}

window.viewportElem = document.getElementById("viewport");
context.domElement.style.height = "100%";
context.domElement.style.width = "100%";
viewportElem.appendChild(context.domElement);

window.render = function () {
	window.requestAnimationFrame(render);

	context.cache.clear();

	context.clear();

	simulate();
	drawTerrain();
	drawWater();
};