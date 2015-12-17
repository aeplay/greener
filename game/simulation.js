var pressureAndVelocity = new GLOW.FBO({
	width: 512,
	height: 512,
	type: GL.HALF_FLOAT,
	magFilter: GL.NEAREST,
	minFilter: GL.NEAREST,
	depth: false,
	data: new Uint8Array(8 * 512 * 512)
});

var pressureAndVelocity2 = new GLOW.FBO({
	width: 512,
	height: 512,
	type: GL.HALF_FLOAT,
	magFilter: GL.NEAREST,
	minFilter: GL.NEAREST,
	depth: false,
	data: new Uint8Array(8 * 512 * 512)
});

const NParticles = 16;

//function initialParticles () {
//	const array = new Uint16Array(4 * NParticles * NParticles);
//
//	for (var i = 0; i < 4 * NParticles * NParticles; i += 4) {
//		array[i] = Math.random() * 0xFFFF;
//		array[i + 1] = Math.random() * 0xFFFF;
//		array[i + 2] = 0.5 * 0xFFF ;
//		array[i + 3] = 0.5 * 0xFFF;
//	}
//
//	return array;
//}

var particles = new GLOW.FBO({
	width: NParticles,
	height: NParticles,
	type: GL.HALF_FLOAT,
	magFilter: GL.NEAREST,
	minFilter: GL.NEAREST,
	depth: false,
	data: new Uint8Array(2 * 4 * NParticles * NParticles)
});

var particles2 = new GLOW.FBO({
	width: NParticles,
	height: NParticles,
	type: GL.HALF_FLOAT,
	magFilter: GL.NEAREST,
	minFilter: GL.NEAREST,
	depth: false,
	data: new Uint8Array(2 * 4 * NParticles * NParticles)
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

var debugParticles = new GLOW.Shader({
	vertexShader: loadSynchronous("shaders/simulationSteps/debugParticle.vert"),
	fragmentShader: loadSynchronous("shaders/simulationSteps/debugParticle.frag"),
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
		slopeTilt: slopeTilt,
		level: new GLOW.Texture({url: 'levels/1.png', flipY: true})
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
});

var initParticles = new GLOW.Shader({
	vertexShader: loadSynchronous("shaders/simulation.vert"),
	fragmentShader: loadSynchronous("shaders/simulationSteps/initParticles.frag"),
	data: {
		vertices: GLOW.Geometry.Plane.vertices(),
	},
	indices: GLOW.Geometry.Plane.indices()
});

context.enableDepthTest(false);
particles.bind();
initParticles.draw();
particles.unbind();
context.enableDepthTest(true);

document.body.onmousemove = function (event) {
	const normalizedX = 2 * (-(event.clientX)/window.innerWidth + 0.5);
	const normalizedY = 2 * (-(event.clientY)/window.innerHeight + 0.5);

	slopeTilt.value[0] = 10 * ((1/Math.sqrt(2)) * normalizedX - Math.sqrt(2) * normalizedY);
	slopeTilt.value[1] = 10 * ((1/Math.sqrt(2)) * normalizedX + Math.sqrt(2) * normalizedY);

	terrain.uniforms.transform.data.setRotation(slopeTilt.value[1] / 40.0, slopeTilt.value[0] / 40.0 , 0);
	water.uniforms.transform.data.setRotation(slopeTilt.value[1] / 40.0, slopeTilt.value[0] / 40.0 , 0);
	debugParticles.uniforms.transform.data.setRotation(slopeTilt.value[1] / 40.0, slopeTilt.value[0] / 40.0 , 0);
};

function simulate () {
	context.enableDepthTest(false);

	for (var i = 0; i < 1; i++) {
		context.enableBlend(true, {
			equation: GL.FUNC_ADD, src: GL.SRC_ALPHA, dst: GL.ONE_MINUS_SRC_ALPHA});
		pressureAndVelocity.bind();
		context.clear({red: 0, green: 0.5, blue: 0.5, alpha: 1});
		splatParticles.uniforms.particles.data = particles;
		splatParticles.draw();
		pressureAndVelocity.unbind();
		context.enableBlend(false);

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
	}

	context.clear();
	pip.uniforms.texture.data = pressureAndVelocity;
	//pip.draw();

	debugParticles.uniforms.particles.data = particles;
	debugParticles.draw();

	context.enableDepthTest(true);
}