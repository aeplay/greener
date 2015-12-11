const terrain = new GLOW.Shader({
	vertexShader: loadSynchronous("shaders/terrain.vert"),
	fragmentShader: loadSynchronous("shaders/terrain.frag"),
	data: {
		vertices: new Float32Array([
			-128, -128, 0,
			128, -128, 0,
			128, 128, 0,
			-128, 128, 0
		]),
		transform: new GLOW.Matrix4(),
		cameraInverse: camera.inverse,
		cameraProjection: camera.projection,
	},
	indices: new Uint16Array([
		0, 1, 2,
		2, 3, 0
	]),
	primitives: GL.TRIANGLES
});

function drawTerrain () {
	terrain.draw();
}