const terrain = new GLOW.Shader({
	vertexShader: loadSynchronous("shaders/terrain.vert"),
	fragmentShader: loadSynchronous("shaders/terrain.frag"),
	data: {
		vertices: new Float32Array([
			-0.5, -0.5, 0,
			0.5, -0.5, 0,
			0.5, 0.5, 0,
			-0.5, 0.5, 0
		])
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