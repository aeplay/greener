var readableSimulationFBO = new GLOW.FBO({
	width: 256,
	height: 256,
	type: GL.UNSIGNED_BYTE,
	magFilter: GL.LINEAR,
	minFilter: GL.LINEAR,
	depth: false,
	data: new Uint8Array(4 * 256 * 256)
});

var writeableSimulationFBO = new GLOW.FBO({
	width: 256,
	height: 256,
	type: GL.UNSIGNED_BYTE,
	magFilter: GL.LINEAR,
	minFilter: GL.LINEAR,
	depth: false,
	data: new Uint8Array(4 * 256 * 256)
});

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
	writeableSimulationFBO.bind();
	load.draw();
	writeableSimulationFBO.unbind();
	context.enableDepthTest(true);
	flipFBOs();
}

function flipFBOs () {
	const temp = readableSimulationFBO;
	readableSimulationFBO = writeableSimulationFBO;
	writeableSimulationFBO = temp;
}

function getReadableSimulationFBO() {
	return readableSimulationFBO;
}

function getWriteableSimulationFBO() {
	return writeableSimulationFBO;
}

const simulationSteps = [
	new GLOW.Shader({
		vertexShader: loadSynchronous("shaders/simulation.vert"),
		fragmentShader: loadSynchronous("shaders/simulationSteps/advection.frag"),
		data: {
			vertices: GLOW.Geometry.Plane.vertices(),
			simulation: getReadableSimulationFBO()
		},
		indices: GLOW.Geometry.Plane.indices()
	}),
	new GLOW.Shader({
		vertexShader: loadSynchronous("shaders/simulation.vert"),
		fragmentShader: loadSynchronous("shaders/simulationSteps/heightUpdate.frag"),
		data: {
			vertices: GLOW.Geometry.Plane.vertices(),
			simulation: getReadableSimulationFBO()
		},
		indices: GLOW.Geometry.Plane.indices()
	}),
	new GLOW.Shader({
		vertexShader: loadSynchronous("shaders/simulation.vert"),
		fragmentShader: loadSynchronous("shaders/simulationSteps/velocityUpdate.frag"),
		data: {
			vertices: GLOW.Geometry.Plane.vertices(),
			simulation: getReadableSimulationFBO()
		},
		indices: GLOW.Geometry.Plane.indices()
	})
];

function simulate () {
	context.enableDepthTest(false);

	for (var i = 0; i < 3; i++) {
		for (var s = 0; s < simulationSteps.length; s++) {
			var step = simulationSteps[s];
			step.uniforms.simulation.data = getReadableSimulationFBO();
			writeableSimulationFBO.bind();
			step.draw();
			writeableSimulationFBO.unbind();
			flipFBOs();
		}
	}

	context.enableDepthTest(true);
}