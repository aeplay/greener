// CONSTANTS

var nParticles = 160;
const fieldResolution = 512;

	const dt = 1/120;
const particleInfluenceRadius = 4;
const pressureForceMultiplier = 5;
const pressureForceExponent = 5;
const initialDensity = 0.2;
const particleViscosity = 0.3;

const terrainResolution = 256;
const terrainSize = 256;

const level = new GLOW.Texture({url: 'levels/level1.png?' + Math.floor(Math.random() * 10000), flipY: true, onLoadComplete: function () {
	var canvas = document.createElement('canvas');
	canvas.width = level.data.width;
	canvas.height = level.data.height;
	canvas.getContext('2d').drawImage(level.data, 0, 0, level.data.width, level.data.height);

	var pixelData = canvas.getContext('2d').getImageData(0, 0, level.data.width, level.data.height).data;

	initTerrain();
	initWater();

	loadWater(pixelData, level.data.width, level.data.height);
	loadTrees(pixelData, level.data.width, level.data.height);
	render();
}});

// BUFFERS
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

var particlePositionX = new EncodedFloatDoubleBuffer(nParticles);
var particlePositionY = new EncodedFloatDoubleBuffer(nParticles);
var particleVelocityX = new EncodedFloatDoubleBuffer(nParticles);
var particleVelocityY = new EncodedFloatDoubleBuffer(nParticles);

function fieldBuffer (resolution) {
	return new GLOW.FBO({
		width: resolution, height: resolution,
		type: GL.HALF_FLOAT_OEM,
		magFilter: GL.LINEAR, minFilter: GL.LINEAR,
		depth: false, data: new Uint8Array(4 * resolution * resolution)
	});
}

function FieldDoubleBuffer (resolution) {
	this.input = fieldBuffer(resolution);
	this.output = fieldBuffer(resolution);
}

FieldDoubleBuffer.prototype.flip = EncodedFloatDoubleBuffer.prototype.flip;

const densityAndVelocity1 = fieldBuffer(fieldResolution);
const densityAndVelocity2 = fieldBuffer(fieldResolution);
const densityAndVelocityHalfBlurred = fieldBuffer(fieldResolution);
const densityAndVelocityBlurred = fieldBuffer(fieldResolution);
const foliageHalf = fieldBuffer(fieldResolution / 4);
const foliage = new FieldDoubleBuffer(fieldResolution / 4);

// SHADERS

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

console.log("blurDensityAndVelocityHalfStep...");

const blurDensityAndVelocityHalfStep = new GLOW.Shader({
	vertexShader: loadSynchronous("shaders/simulationSteps/blurDensityX.vert"),
	fragmentShader: loadSynchronous("shaders/simulationSteps/blurDensity.frag"),
	data: {
		a_position: GLOW.Geometry.Plane.vertices(), // full screen quad
		s_texture: densityAndVelocity2,
		blurFactor: new GLOW.Float(1)
	},
	indices: GLOW.Geometry.Plane.indices()
});

console.log("blurDensityAndVelocityStep...");

const blurDensityAndVelocityStep = new GLOW.Shader({
	vertexShader: loadSynchronous("shaders/simulationSteps/blurDensityY.vert"),
	fragmentShader: loadSynchronous("shaders/simulationSteps/blurDensity.frag"),
	data: {
		a_position: GLOW.Geometry.Plane.vertices(), // full screen quad
		s_texture: densityAndVelocityHalfBlurred,
		blurFactor: new GLOW.Float(1)
	},
	indices: GLOW.Geometry.Plane.indices()
});

console.log("densityToFoliageHalfStep...");

const densityToFoliageHalfStep = new GLOW.Shader({
	vertexShader: loadSynchronous("shaders/simulationSteps/blurDensityX.vert"),
	fragmentShader: loadSynchronous("shaders/simulationSteps/densityToFoliageHalf.frag"),
	data: {
		a_position: GLOW.Geometry.Plane.vertices(), // full screen quad
		s_texture: densityAndVelocityBlurred,
		blurFactor: new GLOW.Float(12)
	},
	indices: GLOW.Geometry.Plane.indices()
});

console.log("densityToFoliageStep...");

const densityToFoliageStep = new GLOW.Shader({
	vertexShader: loadSynchronous("shaders/simulationSteps/blurDensityY.vert"),
	fragmentShader: loadSynchronous("shaders/simulationSteps/densityToFoliage.frag"),
	data: {
		a_position: GLOW.Geometry.Plane.vertices(), // full screen quad
		s_texture: foliageHalf,
		blurFactor: new GLOW.Float(12),
		oldFoliage: foliage.input,
		dt: new GLOW.Float(dt)
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
		nParticles: new GLOW.Float(nParticles),
		transform: new GLOW.Matrix4(),
		cameraInverse: camera.inverse,
		cameraProjection: camera.projection,
		terrainSize: new GLOW.Float(terrainSize)
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

function loadWater(levelData, width, height) {
	const waterSpawnLocations = [];

	for (var x = 0; x < width; x++) {
		for (var y = 0; y < height; y++) {
			var blue = levelData[(x + width * y) * 4 + 2];

			if (blue === 255) {
				var position = [x / width, 1.0 - y / height];
				//console.log("found water spawn location!", position);
				waterSpawnLocations.push(position);
			}
		}
	}

	console.log(waterSpawnLocations.length);
	const waterSpawnLocationLengthRoot = Math.floor(Math.sqrt(waterSpawnLocations.length));
	nParticles = waterSpawnLocationLengthRoot * 32;
	console.log(nParticles);

	const spawnPointMapData = new Uint8Array(4 * waterSpawnLocations.length);

	for (var i = 0; i < waterSpawnLocations.length; i++) {
		spawnPointMapData[i * 4 + 0] = Math.floor(waterSpawnLocations[i][0] * 255);
		spawnPointMapData[i * 4 + 1] = Math.floor(waterSpawnLocations[i][1] * 255);
	}

	const spawnPointMap = new GLOW.Texture({
		data: spawnPointMapData,
		type: GL.UNSIGNED_BYTE,
		width: waterSpawnLocationLengthRoot,
		height: waterSpawnLocationLengthRoot,
		minFilter: GL.NEAREST,
		magFilter: GL.NEAREST,
		wrap: GL.CLAMP_TO_EDGE
	});

	console.log("initializeParticlesXStep...");

	const initializeParticlesXStep = new GLOW.Shader({
		vertexShader: loadSynchronous("shaders/simulationSteps/particleStep.vert"),
		fragmentShader: loadSynchronous("shaders/simulationSteps/initializeParticlesPositionX.frag"),
		data: {
			vertices: GLOW.Geometry.Plane.vertices(), // full screen quad
			spawnPointMap: spawnPointMap,
			nSpawnPointsRoot: new GLOW.Float(waterSpawnLocationLengthRoot)
		},
		indices: GLOW.Geometry.Plane.indices()
	});

	console.log("initializeParticlesYStep...");

	const initializeParticlesYStep = new GLOW.Shader({
		vertexShader: loadSynchronous("shaders/simulationSteps/particleStep.vert"),
		fragmentShader: loadSynchronous("shaders/simulationSteps/initializeParticlesPositionY.frag"),
		data: {
			vertices: GLOW.Geometry.Plane.vertices(), // full screen quad
			spawnPointMap: spawnPointMap,
			nSpawnPointsRoot: new GLOW.Float(waterSpawnLocationLengthRoot)
		},
		indices: GLOW.Geometry.Plane.indices()
	});

	particlePositionX = new EncodedFloatDoubleBuffer(nParticles);
	particlePositionY = new EncodedFloatDoubleBuffer(nParticles);
	particleVelocityX = new EncodedFloatDoubleBuffer(nParticles);
	particleVelocityY = new EncodedFloatDoubleBuffer(nParticles);

	particlePositionX.output.bind();
	initializeParticlesXStep.draw();
	particlePositionX.output.unbind();

	particlePositionY.output.bind();
	initializeParticlesYStep.draw();
	particlePositionY.output.unbind();

	particlePositionX.flip();
	particlePositionY.flip();
}


// RUN

window.addEventListener("deviceorientation", function (event) {
	slopeTilt.value[0] = -event.beta / 10;
	slopeTilt.value[1] = -event.gamma / 10;
}, true);

var mouseDownPosition;

controller.onmousedown = function (e) {
	mouseDownPosition = [e.clientX, e.clientY];
	e.preventDefault();
	return false;
};

document.body.onmousemove = function (e) {
	if (mouseDownPosition) {
		const delta = new GLOW.Vector2(e.clientX - mouseDownPosition[0], e.clientY - mouseDownPosition[1]);

		if (delta.length() > 2 * 16) {
			delta.multiplyScalar(2 * 16 / delta.length());
		}

		console.log(delta.value);

		controller.style.transform = "translate(" + delta.value[0] + "px, " + delta.value[1] + "px)";
		slopeTilt.value[0] = -delta.value[0] / 20;
		slopeTilt.value[1] = delta.value[1] / 20;
	}
};

document.body.onmouseup = function (e) {
	mouseDownPosition = null;
	controller.style.transform = "";
	slopeTilt.value[0] = slopeTilt.value[1] = 0;
};

function simulate () {

	for (var i = 0; i < 10; i++) {
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

	densityAndVelocityHalfBlurred.bind();
	blurDensityAndVelocityHalfStep.draw();
	densityAndVelocityHalfBlurred.unbind();

	densityAndVelocityBlurred.bind();
	blurDensityAndVelocityStep.draw();
	densityAndVelocityBlurred.unbind();

	foliageHalf.bind();
	densityToFoliageHalfStep.draw();
	foliageHalf.unbind();

	foliage.output.bind();
	densityToFoliageStep.uniforms.oldFoliage.data = foliage.input;
	densityToFoliageStep.draw();
	foliage.output.unbind();

	foliage.flip();

	//debugDrawDensityAndVelocity.uniforms.map.data = densityAndVelocity2;
	//debugDrawDensityAndVelocity.draw();

	//debugDrawFloatMaps.uniforms.red = particlePositionX1;
	//debugDrawFloatMaps.uniforms.green = particlePositionY1;
	//
	//debugDrawFloatMaps.draw();

	context.enableDepthTest(true);

	terrain.uniforms.transform.data.setRotation(slopeTilt.value[1] / 40.0, -slopeTilt.value[0] / 40.0 , 0);
	trees.uniforms.transform.data.setRotation(slopeTilt.value[1] / 40.0, -slopeTilt.value[0] / 40.0 , 0);
	grass.uniforms.transform.data.setRotation(slopeTilt.value[1] / 40.0, -slopeTilt.value[0] / 40.0 , 0);
	water.uniforms.transform.data.setRotation(slopeTilt.value[1] / 40.0, -slopeTilt.value[0] / 40.0 , 0);

	//debugDrawParticles.uniforms.particlePositionX.data = particlePositionX.input;
	//debugDrawParticles.uniforms.particlePositionY.data = particlePositionY.input;
	//debugDrawParticles.draw();
}
