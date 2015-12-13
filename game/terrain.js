const terrain = new GLOW.Shader({
	vertexShader: loadSynchronous("shaders/terrain.vert"),
	fragmentShader: loadSynchronous("shaders/terrain.frag"),
	data: {
		vertices: gridVertices(),
		transform: new GLOW.Matrix4(),
		cameraInverse: camera.inverse,
		cameraProjection: camera.projection,
		level: new GLOW.Texture({url: 'levels/1.png'})
	},
	indices: gridIndices()
});

function drawTerrain () {
	terrain.draw();
}