const water = new GLOW.Shader({
	vertexShader: loadSynchronous("shaders/water.vert"),
	fragmentShader: loadSynchronous("shaders/water.frag"),
	data: {
		vertices: gridVertices(),
		transform: new GLOW.Matrix4(),
		cameraInverse: camera.inverse,
		cameraProjection: camera.projection,
		simulation: getReadableSimulationFBO()
	},
	indices: gridIndices()
});

function drawWater () {
	water.uniforms.simulation.data = getReadableSimulationFBO();
	context.enableBlend(true, {
		equation: GL.FUNC_ADD, src: GL.SRC_ALPHA, dst: GL.ONE_MINUS_SRC_ALPHA});
	water.draw();
	context.enableBlend(false);
}