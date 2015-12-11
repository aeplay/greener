const terrain = new GLOW.Shader({
	vertexShader: loadSynchronous("shaders/terrain.vert"),
	fragmentShader: loadSynchronous("shaders/terrain.frag"),
	data: {
		vertices: gridVertices(),
		transform: new GLOW.Matrix4(),
		cameraInverse: camera.inverse,
		cameraProjection: camera.projection,
		texture: new GLOW.Texture({data: "levels/0/terrain.png", minFilter: GL.NEAREST})
	},
	indices: gridIndices(),
	primitives: GL.TRIANGLES
});

function drawTerrain () {
	terrain.draw();
}