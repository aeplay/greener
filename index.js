window.onload = function () {
	const devicePixelRatio = 1.0;

	window.context = new GLOW.Context({
		clear: {red: 0.4, green: 0.4, blue: 0.4},
		preserveDrawingBuffer: true,
		width: window.innerWidth * devicePixelRatio,
		height: window.innerHeight * devicePixelRatio
	});

	window.viewportElem = document.getElementById("viewport");
	context.domElement.style.height = "100%";
	context.domElement.style.width = "100%";
	viewportElem.appendChild(context.domElement);
};