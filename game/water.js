const water = new GLOW.Shader({
	vertexShader: loadSynchronous("shaders/water.vert"),
	fragmentShader: loadSynchronous("shaders/water.frag"),
	data: {
		vertices: gridVertices(),
		transform: new GLOW.Matrix4(),
		cameraInverse: camera.inverse,
		cameraProjection: camera.projection,
		pressureAndVelocity: pressureAndVelocity,
		level: new GLOW.Texture({url: 'levels/1.png'})
	},
	indices: gridIndices()
});

function drawWater () {
	water.uniforms.pressureAndVelocity.data = pressureAndVelocity;
	context.enableBlend(true, {
		equation: GL.FUNC_ADD, src: GL.SRC_ALPHA, dst: GL.ONE_MINUS_SRC_ALPHA});
	water.draw();
	context.enableBlend(false);

	debugParticles.uniforms.particles.data = particles;
	debugParticles.draw();
}