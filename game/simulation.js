var readableTerrainAndWater = new GLOW.FBO({
	width: 256,
	height: 256,
	type: GL.HALF_FLOAT,
	magFilter: GL.NEAREST,
	minFilter: GL.NEAREST,
	depth: false,
	data: new Uint8Array(8 * 256 * 256)
});

var writeableTerrainAndWater = new GLOW.FBO({
	width: 256,
	height: 256,
	type: GL.HALF_FLOAT,
	magFilter: GL.NEAREST,
	minFilter: GL.NEAREST,
	depth: false,
	data: new Uint8Array(8 * 256 * 256)
});

getReadableTerrainAndWater = function () {
	return readableTerrainAndWater;
};

getWriteableTerrainAndWater = function () {
	return writeableTerrainAndWater;
};

flipTerrainAndWater = function () {
	var temp = readableTerrainAndWater;
	readableTerrainAndWater = writeableTerrainAndWater;
	writeableTerrainAndWater = temp;
};

var readableOutflows = new GLOW.FBO({
	width: 256,
	height: 256,
	type: GL.HALF_FLOAT,
	magFilter: GL.LINEAR,
	minFilter: GL.LINEAR,
	depth: false,
	data: new Uint8Array(8 * 256 * 256)
});

var writeableOutflows = new GLOW.FBO({
	width: 256,
	height: 256,
	type: GL.HALF_FLOAT,
	magFilter: GL.LINEAR,
	minFilter: GL.LINEAR,
	depth: false,
	data: new Uint8Array(8 * 256 * 256)
});

getReadableOutflows = function () {
	return readableOutflows;
};

getWriteableOutflows = function () {
	return writeableOutflows;
};

flipOutflows = function () {
	var temp = readableOutflows;
	readableOutflows = writeableOutflows;
	writeableOutflows = temp;
};

function loadLevel (levelImage) {
	const load = new GLOW.Shader({
		vertexShader: loadSynchronous("shaders/simulation.vert"),
		fragmentShader: loadSynchronous("shaders/loadLevel.frag"),
		data: {
			vertices: GLOW.Geometry.Plane.vertices(),
			level: new GLOW.Texture({data: levelImage, minFilter: GL.NEAREST})
		},
		indices: GLOW.Geometry.Plane.indices()
	});

	context.enableDepthTest(false);
	getWriteableTerrainAndWater().bind();
	load.draw();
	getWriteableTerrainAndWater().unbind();
	context.enableDepthTest(true);
	flipTerrainAndWater();
}

slopeTilt = new GLOW.Vector2(0, 0);

const outflowsStep = new GLOW.Shader({
	vertexShader: loadSynchronous("shaders/simulation.vert"),
	fragmentShader: loadSynchronous("shaders/simulationSteps/updateOutflows.frag"),
	data: {
		vertices: GLOW.Geometry.Plane.vertices(),
		terrainAndWater: getReadableTerrainAndWater(),
		oldOutflows: getReadableOutflows()
	},
	indices: GLOW.Geometry.Plane.indices()
});

const heightStep = new GLOW.Shader({
	vertexShader: loadSynchronous("shaders/simulation.vert"),
	fragmentShader: loadSynchronous("shaders/simulationSteps/updateHeights.frag"),
	data: {
		vertices: GLOW.Geometry.Plane.vertices(),
		terrainAndWater: getReadableTerrainAndWater(),
		outflows: getReadableOutflows()
	},
	indices: GLOW.Geometry.Plane.indices()
});

document.body.onmousemove = function (event) {
	const normalizedX = 2 * (-(event.clientX)/window.innerWidth + 0.5);
	const normalizedY = 2 * (-(event.clientY)/window.innerHeight + 0.5);

	slopeTilt.value[0] = 3 * ((1/Math.sqrt(2)) * normalizedX - Math.sqrt(2) * normalizedY);
	slopeTilt.value[1] = 3 * ((1/Math.sqrt(2)) * normalizedX + Math.sqrt(2) * normalizedY);
};

function simulate () {
	context.enableDepthTest(false);

	outflowsStep.uniforms.terrainAndWater.data = getReadableTerrainAndWater();
	outflowsStep.uniforms.oldOutflows.data = getReadableOutflows();
	outflowsStep.uniforms.slopeTilt = slopeTilt;
	getWriteableOutflows().bind();
	outflowsStep.draw();
	getWriteableOutflows().unbind();
	flipOutflows();

	heightStep.uniforms.terrainAndWater.data = getReadableTerrainAndWater();
	heightStep.uniforms.outflows.data = getReadableOutflows();
	getWriteableTerrainAndWater().bind();
	heightStep.draw();
	getWriteableTerrainAndWater().unbind();
	flipTerrainAndWater();

	context.enableDepthTest(true);
}