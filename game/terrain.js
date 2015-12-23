console.log("terrain...");

const terrain = new GLOW.Shader({
	vertexShader: loadSynchronous("shaders/terrain.vert"),
	fragmentShader: loadSynchronous("shaders/terrain.frag"),
	data: {
		vertices: gridVertices(terrainResolution),
		transform: new GLOW.Matrix4(),
		cameraInverse: camera.inverse,
		cameraProjection: camera.projection,
		level: level,
		foliage: foliage,
		terrainSize: new GLOW.Float(terrainSize)
	},
	indices: gridIndices(terrainResolution)
});

const grass = new GLOW.Shader({
	vertexShader: loadSynchronous("shaders/grass.vert"),
	fragmentShader: loadSynchronous("shaders/grass.frag"),
	data: {
		vertices: gridVertices(terrainResolution/2),
		transform: new GLOW.Matrix4(),
		cameraInverse: camera.inverse,
		cameraProjection: camera.projection,
		level: level,
		foliage: foliage,
		terrainSize: new GLOW.Float(terrainSize)
	},
	primitives: GL.POINTS
});

function drawTerrain () {
	terrain.draw();
	grass.draw();
}