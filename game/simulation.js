// CONSTANTS

const nParticles = 128;
const fieldResolution = 512;

const dt = 1/120;
const particleInfluenceRadius = 8;
const pressureForceMultiplier = 1;
const pressureForceExponent = 5;
const initialDensity = 0.3;
const particleViscosity = 0.1;

// BUFFERS
const level = new GLOW.Texture({url: 'levels/0.png', flipY: true});

function EncodedFloatDoubleBuffer (dimension) {
	this.input = new GLOW.FBO({
		width: dimension, height: dimension,
		type: GL.UNSIGNED_BYTE,
		magFilter: GL.NEAREST, minFilter: GL.NEAREST,
		depth: false, data: new Uint8Array(4 * dimension * dimension)
	});

	this.output = new GLOW.FBO({
		width: dimension, height: dimension,
		type: GL.UNSIGNED_BYTE,
		magFilter: GL.NEAREST, minFilter: GL.NEAREST,
		depth: false, data: new Uint8Array(4 * dimension * dimension)
	});
}

EncodedFloatDoubleBuffer.prototype.flip = function flip () {
	const temp = this.output;
	this.output = this.input;
	this.input = temp;
};

const particlePositionX = new EncodedFloatDoubleBuffer(nParticles);
const particlePositionY = new EncodedFloatDoubleBuffer(nParticles);
const particleVelocityX = new EncodedFloatDoubleBuffer(nParticles);
const particleVelocityY = new EncodedFloatDoubleBuffer(nParticles);

function fieldBuffer () {
	return new GLOW.FBO({
		width: fieldResolution, height: fieldResolution,
		type: GL.HALF_FLOAT,
		magFilter: GL.LINEAR, minFilter: GL.LINEAR,
		depth: false, data: new Uint8Array(4 * fieldResolution * fieldResolution)
	});
}

const densityAndVelocity1 = fieldBuffer();
const densityAndVelocity2 = fieldBuffer();

// SHADERS

console.log("initializeParticlesXStep...");

const initializeParticlesXStep = new GLOW.Shader({
	vertexShader: loadSynchronous("shaders/simulationSteps/particleStep.vert"),
	fragmentShader: loadSynchronous("shaders/simulationSteps/initializeParticlesPositionX.frag"),
	data: {
		vertices: GLOW.Geometry.Plane.vertices() // full screen quad
	},
	indices: GLOW.Geometry.Plane.indices()
});

console.log("initializeParticlesYStep...");

const initializeParticlesYStep = new GLOW.Shader({
	vertexShader: loadSynchronous("shaders/simulationSteps/particleStep.vert"),
	fragmentShader: loadSynchronous("shaders/simulationSteps/initializeParticlesPositionY.frag"),
	data: {
		vertices: GLOW.Geometry.Plane.vertices() // full screen quad
	},
	indices: GLOW.Geometry.Plane.indices()
});

console.log("splatParticlesStep...");

const splatParticlesStep = new GLOW.Shader({
	vertexShader: loadSynchronous("shaders/simulationSteps/splatParticles.vert"),
	fragmentShader: loadSynchronous("shaders/simulationSteps/splatParticles.frag"),
	data: {
		particleLookupCoordinate: gridVertices(nParticles),
		particlePositionX: particlePositionX.input,
		particlePositionY: particlePositionY.input,
		particleVelocityX: particleVelocityX.input,
		particleVelocityY: particleVelocityY.input,
		particleInfluenceRadius: new GLOW.Float(particleInfluenceRadius)
	},
	primitives: GL.POINTS
});

console.log("calculateVelocityFieldStep...");

const slopeTilt = new GLOW.Vector2(-0.1, 0);

const calculateVelocityFieldStep = new GLOW.Shader({
	vertexShader: loadSynchronous("shaders/simulationSteps/fieldStep.vert"),
	fragmentShader: loadSynchronous("shaders/simulationSteps/calculateVelocityField.frag"),
	data: {
		vertices: GLOW.Geometry.Plane.vertices(), // full screen quad
		densityAndVelocity: densityAndVelocity1,
		fieldResolution: new GLOW.Float(fieldResolution),
		pressureForceMultiplier: new GLOW.Float(pressureForceMultiplier),
		pressureForceExponent: new GLOW.Float(pressureForceExponent),
		initialDensity: new GLOW.Float(initialDensity),
		dt: new GLOW.Float(dt),
		slopeTilt: slopeTilt,
		level: level
	},
	indices: GLOW.Geometry.Plane.indices()
});

console.log("moveParticlesPositionXStep...");

const moveParticlesPositionXStep = new GLOW.Shader({
	vertexShader: loadSynchronous("shaders/simulationSteps/particleStep.vert"),
	fragmentShader: loadSynchronous("shaders/simulationSteps/moveParticlesPositionX.frag"),
	data: {
		vertices: GLOW.Geometry.Plane.vertices(), // full screen quad
		oldDensityAndVelocity: densityAndVelocity1,
		densityAndVelocity: densityAndVelocity2,
		particlePositionX: particlePositionX.input,
		particlePositionY: particlePositionY.input,
		particleVelocityX: particleVelocityX.input,
		particleVelocityY: particleVelocityY.input,
		dt: new GLOW.Float(dt),
		particleViscosity: new GLOW.Float(particleViscosity)
	},
	indices: GLOW.Geometry.Plane.indices()
});

const moveParticlesPositionYStep = new GLOW.Shader({
	vertexShader: loadSynchronous("shaders/simulationSteps/particleStep.vert"),
	fragmentShader: loadSynchronous("shaders/simulationSteps/moveParticlesPositionY.frag"),
	data: {
		vertices: GLOW.Geometry.Plane.vertices(), // full screen quad
		oldDensityAndVelocity: densityAndVelocity1,
		densityAndVelocity: densityAndVelocity2,
		particlePositionX: particlePositionX.input,
		particlePositionY: particlePositionY.input,
		particleVelocityX: particleVelocityX.input,
		particleVelocityY: particleVelocityY.input,
		dt: new GLOW.Float(dt),
		particleViscosity: new GLOW.Float(particleViscosity)
	},
	indices: GLOW.Geometry.Plane.indices()
});

const moveParticlesVelocityXStep = new GLOW.Shader({
	vertexShader: loadSynchronous("shaders/simulationSteps/particleStep.vert"),
	fragmentShader: loadSynchronous("shaders/simulationSteps/moveParticlesVelocityX.frag"),
	data: {
		vertices: GLOW.Geometry.Plane.vertices(), // full screen quad
		oldDensityAndVelocity: densityAndVelocity1,
		densityAndVelocity: densityAndVelocity2,
		particlePositionX: particlePositionX.input,
		particlePositionY: particlePositionY.input,
		particleVelocityX: particleVelocityX.input,
		particleVelocityY: particleVelocityY.input,
		dt: new GLOW.Float(dt),
		particleViscosity: new GLOW.Float(particleViscosity)
	},
	indices: GLOW.Geometry.Plane.indices()
});

const moveParticlesVelocityYStep = new GLOW.Shader({
	vertexShader: loadSynchronous("shaders/simulationSteps/particleStep.vert"),
	fragmentShader: loadSynchronous("shaders/simulationSteps/moveParticlesVelocityY.frag"),
	data: {
		vertices: GLOW.Geometry.Plane.vertices(), // full screen quad
		oldDensityAndVelocity: densityAndVelocity1,
		densityAndVelocity: densityAndVelocity2,
		particlePositionX: particlePositionX.input,
		particlePositionY: particlePositionY.input,
		particleVelocityX: particleVelocityX.input,
		particleVelocityY: particleVelocityY.input,
		dt: new GLOW.Float(dt),
		particleViscosity: new GLOW.Float(particleViscosity)
	},
	indices: GLOW.Geometry.Plane.indices()
});

// DEBUG SHADERS

console.log("debugDrawParticles...");

const debugDrawParticles = new GLOW.Shader({
	vertexShader: loadSynchronous("shaders/simulationSteps/debugDrawParticles.vert"),
	fragmentShader: loadSynchronous("shaders/simulationSteps/debugDrawParticles.frag"),
	data: {
		particleLookupCoordinate: gridVertices(nParticles),
		particlePositionX: particlePositionX.input,
		particlePositionY: particlePositionY.input,
		nParticles: new GLOW.Float(nParticles)
	},
	primitives: GL.POINTS
});

console.log("debugDrawFloatMaps...");

const debugDrawFloatMaps = new GLOW.Shader({
	vertexShader: loadSynchronous("shaders/simulationSteps/particleStep.vert"),
	fragmentShader: loadSynchronous("shaders/simulationSteps/debugDrawFloatMaps.frag"),
	data: {
		vertices: GLOW.Geometry.Plane.vertices(), // full screen quad
		red: particlePositionX.input,
		green: particlePositionY.input
	},
	indices: GLOW.Geometry.Plane.indices()
});

console.log("debugDrawDensityAndVelocity...");

const debugDrawDensityAndVelocity = new GLOW.Shader({
	vertexShader: loadSynchronous("shaders/simulationSteps/particleStep.vert"),
	fragmentShader: loadSynchronous("shaders/simulationSteps/debugDraw4HalfFloatsMaps.frag"),
	data: {
		vertices: GLOW.Geometry.Plane.vertices(), // full screen quad
		map: densityAndVelocity1
	},
	indices: GLOW.Geometry.Plane.indices()
});

// INIT

particlePositionX.output.bind();
initializeParticlesXStep.draw();
particlePositionX.output.unbind();

particlePositionY.output.bind();
initializeParticlesYStep.draw();
particlePositionY.output.unbind();

particlePositionX.flip();
particlePositionY.flip();

// RUN

window.addEventListener("deviceorientation", function (event) {
	slopeTilt.value[0] = -event.gamma / 50;
	slopeTilt.value[1] = event.beta / 50;
}, true);

function simulate () {

	for (var i = 0; i < 5; i++) {
		context.enableDepthTest(false);

		splatParticlesStep.uniforms.particlePositionX.data = particlePositionX.input;
		splatParticlesStep.uniforms.particlePositionY.data = particlePositionY.input;

		context.enableBlend(true, {
			equation: GL.FUNC_ADD, src: GL.SRC_ALPHA, dst: GL.ONE_MINUS_SRC_ALPHA
		});
		densityAndVelocity1.bind();
		context.clear({red: 0, green: 0.5, blue: 0.5});
		splatParticlesStep.draw();
		densityAndVelocity1.unbind();
		context.enableBlend(false);

		calculateVelocityFieldStep.uniforms.densityAndVelocity.data = densityAndVelocity1;
		calculateVelocityFieldStep.uniforms.slopeTilt = slopeTilt;
		densityAndVelocity2.bind();
		calculateVelocityFieldStep.draw();
		densityAndVelocity2.unbind();

		// move particles (pos)

		moveParticlesPositionXStep.uniforms.particlePositionX.data = particlePositionX.input;
		moveParticlesPositionXStep.uniforms.particlePositionY.data = particlePositionY.input;
		moveParticlesPositionXStep.uniforms.particleVelocityX.data = particleVelocityX.input;
		moveParticlesPositionXStep.uniforms.particleVelocityY.data = particleVelocityY.input;

		particlePositionX.output.bind();
		moveParticlesPositionXStep.draw();
		particlePositionX.output.unbind();

		moveParticlesPositionYStep.uniforms.particlePositionX.data = particlePositionX.input;
		moveParticlesPositionYStep.uniforms.particlePositionY.data = particlePositionY.input;
		moveParticlesPositionYStep.uniforms.particleVelocityX.data = particleVelocityX.input;
		moveParticlesPositionYStep.uniforms.particleVelocityY.data = particleVelocityY.input;

		particlePositionY.output.bind();
		moveParticlesPositionYStep.draw();
		particlePositionY.output.unbind();

		// move particles (vel)

		moveParticlesVelocityXStep.uniforms.particlePositionX.data = particlePositionX.input;
		moveParticlesVelocityXStep.uniforms.particlePositionY.data = particlePositionY.input;
		moveParticlesVelocityXStep.uniforms.particleVelocityX.data = particleVelocityX.input;
		moveParticlesVelocityXStep.uniforms.particleVelocityY.data = particleVelocityY.input;

		particleVelocityX.output.bind();
		moveParticlesVelocityXStep.draw();
		particleVelocityX.output.unbind();

		moveParticlesVelocityYStep.uniforms.particlePositionX.data = particlePositionX.input;
		moveParticlesVelocityYStep.uniforms.particlePositionY.data = particlePositionY.input;
		moveParticlesVelocityYStep.uniforms.particleVelocityX.data = particleVelocityX.input;
		moveParticlesVelocityYStep.uniforms.particleVelocityY.data = particleVelocityY.input;

		particleVelocityY.output.bind();
		moveParticlesVelocityYStep.draw();
		particleVelocityY.output.unbind();

		// move particles (flip)

		particlePositionX.flip();
		particlePositionY.flip();
		particleVelocityX.flip();
		particleVelocityY.flip();

	}
	// draw

	debugDrawDensityAndVelocity.uniforms.map.data = densityAndVelocity2;
	debugDrawDensityAndVelocity.draw();

	//debugDrawFloatMaps.uniforms.red = particlePositionX1;
	//debugDrawFloatMaps.uniforms.green = particlePositionY1;
	//
	//debugDrawFloatMaps.draw();

	debugDrawParticles.uniforms.particlePositionX.data = particlePositionX.input;
	debugDrawParticles.uniforms.particlePositionY.data = particlePositionY.input;

	//debugDrawParticles.draw();

	context.enableDepthTest(true);
}