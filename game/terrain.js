const terrain = new GLOW.Shader({
	vertexShader: loadSynchronous("shaders/terrain.vert"),
	fragmentShader: loadSynchronous("shaders/terrain.frag"),
	data: {
		vertices: gridVertices(terrainResolution),
		transform: new GLOW.Matrix4(),
		cameraInverse: camera.inverse,
		cameraProjection: camera.projection,
		level: level,
		densityAndVelocity: densityAndVelocity2,
		terrainSize: new GLOW.Float(terrainSize)
	},
	indices: gridIndices(terrainResolution)
});

function drawTerrain () {
	terrain.uniforms.densityAndVelocity.data = densityAndVelocity2;
	terrain.draw();
}