const trees = new GLOW.Shader({
	vertexShader: loadSynchronous("shaders/trees.vert"),
	fragmentShader: loadSynchronous("shaders/trees.frag"),
	data: {
		vertices: gridVertices(),
		transform: new GLOW.Matrix4(),
		cameraInverse: camera.inverse,
		cameraProjection: camera.projection,
		level: new GLOW.Texture({url: 'levels/1.png'}),
		pressureAndVelocity: pressureAndVelocity,
		treeInfo:
	},
	indices: gridIndices()
});

function drawTerrain () {
	terrain.uniforms.pressureAndVelocity.data = pressureAndVelocity;
	terrain.draw();
}