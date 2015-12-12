var pressureAndVelocity = new GLOW.FBO({
	width: 256,
	height: 256,
	type: GL.FLOAT,
	magFilter: GL.LINEAR,
	minFilter: GL.LINEAR,
	depth: false,
	data: new Float32Array(4 * 256 * 256)
});

var pressureAndVelocity2 = new GLOW.FBO({
	width: 256,
	height: 256,
	type: GL.FLOAT,
	magFilter: GL.LINEAR,
	minFilter: GL.LINEAR,
	depth: false,
	data: new Float32Array(4 * 256 * 256)
});

function initialParticles () {
	const array = new Float32Array(4 * 256 * 256);

	for (var i = 0; i < 4 * 256 * 256; i += 4) {
		array[i] = Math.random() * 0.5 + 0.25;
		array[i + 1] = Math.random() * 0.5 + 0.25;
		array[i + 2] = 0;
		array[i + 3] = 0;
	}

	return array;
}

var particles = new GLOW.FBO({
	width: 256,
	height: 256,
	type: GL.FLOAT,
	magFilter: GL.NEAREST,
	minFilter: GL.NEAREST,
	depth: false,
	data: initialParticles()
});

var particles2 = new GLOW.FBO({
	width: 256,
	height: 256,
	type: GL.FLOAT,
	magFilter: GL.NEAREST,
	minFilter: GL.NEAREST,
	depth: false,
	data: initialParticles()
});

var splatParticles = new GLOW.Shader({
	vertexShader: loadSynchronous("shaders/simulationSteps/splatParticle.vert"),
	fragmentShader: loadSynchronous("shaders/simulationSteps/splatParticle.frag"),
	data: {
		vertices: gridVertices(),
		transform: new GLOW.Matrix4(),
		cameraInverse: camera.inverse,
		cameraProjection: camera.projection,
		particles: particles
	},
	primitives: GL.POINTS
});

var pip = new GLOW.Shader({
	vertexShader: loadSynchronous("shaders/simulation.vert"),
	fragmentShader: loadSynchronous("shaders/id.frag"),
	data: {
		vertices: GLOW.Geometry.Plane.vertices(),
		texture: pressureAndVelocity
	},
	indices: GLOW.Geometry.Plane.indices()
});

var slopeTilt = new GLOW.Vector2(0, 0);

var calculateVelocities = new GLOW.Shader({
	vertexShader: loadSynchronous("shaders/simulation.vert"),
	fragmentShader: loadSynchronous("shaders/simulationSteps/calculateVelocities.frag"),
	data: {
		vertices: GLOW.Geometry.Plane.vertices(),
		pressureAndVelocity: pressureAndVelocity,
		slopeTilt: slopeTilt
	},
	indices: GLOW.Geometry.Plane.indices()
});

var moveParticles = new GLOW.Shader({
	vertexShader: loadSynchronous("shaders/simulation.vert"),
	fragmentShader: loadSynchronous("shaders/simulationSteps/moveParticle.frag"),
	data: {
		vertices: GLOW.Geometry.Plane.vertices(),
		oldPressureAndVelocity: pressureAndVelocity,
		pressureAndVelocity: pressureAndVelocity
	},
	indices: GLOW.Geometry.Plane.indices()
})



document.body.onmousemove = function (event) {
	const normalizedX = 2 * (-(event.clientX)/window.innerWidth + 0.5);
	const normalizedY = 2 * (-(event.clientY)/window.innerHeight + 0.5);

	slopeTilt.value[0] = 3 * ((1/Math.sqrt(2)) * normalizedX - Math.sqrt(2) * normalizedY);
	slopeTilt.value[1] = 3 * ((1/Math.sqrt(2)) * normalizedX + Math.sqrt(2) * normalizedY);
};

function simulate () {
	context.enableDepthTest(false);
	context.enableBlend(true, {
		equation: GL.FUNC_ADD, src: GL.SRC_ALPHA, dst: GL.ONE});
	pressureAndVelocity.bind();
	context.clear({red: 0, green: 0, blue: 0, alpha: 0});
	splatParticles.uniforms.particles.data = particles;
	splatParticles.draw();
	pressureAndVelocity.unbind();
	context.enableBlend(false);

	context.clear();
	pip.uniforms.texture.data = pressureAndVelocity;
	pip.draw();

	pressureAndVelocity2.bind();
	calculateVelocities.uniforms.pressureAndVelocity.data = pressureAndVelocity;
	calculateVelocities.uniforms.slopeTilt = slopeTilt;
	calculateVelocities.draw();
	pressureAndVelocity2.unbind();

	particles2.bind();
	moveParticles.uniforms.oldPressureAndVelocity.data = pressureAndVelocity;
	moveParticles.uniforms.pressureAndVelocity.data = pressureAndVelocity2;
	moveParticles.uniforms.particles.data = particles;
	moveParticles.draw();
	particles2.unbind();

	var temp = particles2;
	particles2 = particles;
	particles = temp;

	context.enableDepthTest(true);
}