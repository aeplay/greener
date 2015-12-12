const terrain = new GLOW.Shader({
	vertexShader: loadSynchronous("shaders/terrain.vert"),
	fragmentShader: loadSynchronous("shaders/terrain.frag"),
	data: {
		vertices: gridVertices(),
		transform: new GLOW.Matrix4(),
		cameraInverse: camera.inverse,
		cameraProjection: camera.projection,
		simulation: getReadableSimulationFBO()
	},
	indices: gridIndices(),
});

function drawTerrain () {
	terrain.uniforms.simulation.data = getReadableSimulationFBO();
	terrain.draw();
}