var readableSimulationFBO = new GLOW.FBO({
	width: 256,
	height: 256,
	type: GL.HALF_FLOAT,
	magFilter: GL.LINEAR,
	minFilter: GL.LINEAR,
	depth: false,
	data: new Uint8Array(8 * 256 * 256)
});

var writeableSimulationFBO = new GLOW.FBO({
	width: 256,
	height: 256,
	type: GL.HALF_FLOAT,
	magFilter: GL.LINEAR,
	minFilter: GL.LINEAR,
	depth: false,
	data: new Uint8Array(8 * 256 * 256)
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

slopeTilt = new GLOW.Vector2(0, 0);

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
			simulation: getReadableSimulationFBO(),
			slopeTilt: slopeTilt
		},
		indices: GLOW.Geometry.Plane.indices()
	})
];

document.body.onmousemove = function (event) {
	const normalizedX = 2 * (-(event.clientX)/window.innerWidth + 0.5);
	const normalizedY = 2 * (-(event.clientY)/window.innerHeight + 0.5);

	slopeTilt.value[0] = 3 * ((1/Math.sqrt(2)) * normalizedX - Math.sqrt(2) * normalizedY);
	slopeTilt.value[1] = 3 * ((1/Math.sqrt(2)) * normalizedX + Math.sqrt(2) * normalizedY);
};

function simulate () {
	context.enableDepthTest(false);

	for (var i = 0; i < 3; i++) {
		for (var s = 0; s < simulationSteps.length; s++) {
			var step = simulationSteps[s];
			step.uniforms.simulation.data = getReadableSimulationFBO();
			if (step.uniforms.slopeTilt) step.uniforms.slopeTilt = slopeTilt;
			writeableSimulationFBO.bind();
			step.draw();
			writeableSimulationFBO.unbind();
			flipFBOs();
		}
	}

	context.enableDepthTest(true);
}