const terrain = new GLOW.Shader({
	vertexShader: loadSynchronous("shaders/terrain.vert"),
	fragmentShader: loadSynchronous("shaders/terrain.frag"),
	data: {
		vertices: gridVertices(),
		transform: new GLOW.Matrix4(),
		cameraInverse: camera.inverse,
		cameraProjection: camera.projection,
		terrainAndWater: getReadableTerrainAndWater(),
		outflows: getReadableOutflows()
	},
	indices: gridIndices()
});

function drawTerrain () {
	terrain.uniforms.terrainAndWater.data = getReadableTerrainAndWater();
	terrain.draw();
}