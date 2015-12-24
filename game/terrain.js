function initTerrain () {
	console.log("terrain...");

	window.terrain = new GLOW.Shader({
		vertexShader: loadSynchronous("shaders/terrain.vert"),
		fragmentShader: loadSynchronous("shaders/terrain.frag"),
		data: {
			vertices: gridVertices(terrainResolution),
			transform: new GLOW.Matrix4(),
			cameraInverse: camera.inverse,
			cameraProjection: camera.projection,
			level: level,
			foliage: foliage.input,
			terrainSize: new GLOW.Float(terrainSize)
		},
		indices: gridIndices(terrainResolution)
	});

	window.grass = new GLOW.Shader({
		vertexShader: loadSynchronous("shaders/grass.vert"),
		fragmentShader: loadSynchronous("shaders/grass.frag"),
		data: {
			vertices: gridVertices(terrainResolution/2),
			transform: new GLOW.Matrix4(),
			cameraInverse: camera.inverse,
			cameraProjection: camera.projection,
			level: level,
			foliage: foliage.input,
			terrainSize: new GLOW.Float(terrainSize)
		},
		primitives: GL.POINTS
	});

	window.drawTerrain = function drawTerrain () {
		terrain.uniforms.foliage.data = foliage.input;
		grass.uniforms.foliage.data = foliage.input;
		terrain.draw();
		grass.draw();
	}
}