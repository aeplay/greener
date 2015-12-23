console.log("water...");

const water = new GLOW.Shader({
	vertexShader: loadSynchronous("shaders/water.vert"),
	fragmentShader: loadSynchronous("shaders/water.frag"),
	data: {
		vertices: gridVertices(terrainResolution),
		transform: new GLOW.Matrix4(),
		cameraInverse: camera.inverse,
		cameraProjection: camera.projection,
		densityAndVelocity: densityAndVelocityBlurred,
		level: level,
		terrainSize: new GLOW.Float(terrainSize),
		waterResolution: new GLOW.Float(terrainResolution)
	},
	indices: gridIndices(terrainResolution)
});

function drawWater () {
	water.uniforms.densityAndVelocity.data = densityAndVelocityBlurred;
	context.enableBlend(true, {
		equation: GL.FUNC_ADD, src: GL.SRC_ALPHA, dst: GL.ONE_MINUS_SRC_ALPHA});
	water.draw();
	context.enableBlend(false);
}