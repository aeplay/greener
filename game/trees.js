const equilateralTriangleHeight = Math.sqrt(3) / 2;

function branchVertices (outVertices, nBranchesPerTree, nTrees) {

	for (var t = 0; t < nTrees; t++) {

		for (var i = 0; i < nBranchesPerTree; i++) {
			var branchOffset = t * nBranchesPerTree * 18 + i * 18;

			// base: equilateral triangle
			outVertices[branchOffset + 0 + 0] = -0.5;
			outVertices[branchOffset + 0 + 1] = -0.5 * equilateralTriangleHeight;
			outVertices[branchOffset + 0 + 2] = 0;

			outVertices[branchOffset + 3 + 0] = 0.5;
			outVertices[branchOffset + 3 + 1] = -0.5 * equilateralTriangleHeight;
			outVertices[branchOffset + 3 + 2] = 0;

			outVertices[branchOffset + 6 + 0] = 0;
			outVertices[branchOffset + 6 + 1] = 0.5 * equilateralTriangleHeight;
			outVertices[branchOffset + 6 + 2] = 0;

			// top: equilateral triangle
			outVertices[branchOffset + 9 + 0] = -0.5;
			outVertices[branchOffset + 9 + 1] = -0.5 * equilateralTriangleHeight;
			outVertices[branchOffset + 9 + 2] = 0;

			outVertices[branchOffset + 12 + 0] = 0.5;
			outVertices[branchOffset + 12 + 1] = -0.5 * equilateralTriangleHeight;
			outVertices[branchOffset + 12 + 2] = 0;

			outVertices[branchOffset + 15 + 0] = 0;
			outVertices[branchOffset + 15 + 1] = 0.5 * equilateralTriangleHeight;
			outVertices[branchOffset + 15 + 2] = 0;
		}

	}


	return outVertices;
}

function branchInfo (outInfo, nBranchesPerTree, nTrees, branchingFactor) {

	for (var t = 0; t < nTrees; t++) {

		var level = 0;
		var branchesInThisLevel = 1;
		var nextLevelAfter = 1;

		for (var i = 0; i < nBranchesPerTree; i++) {
			var branchOffset = t * nBranchesPerTree * 24 + i * 24;

			// base: equilateral triangle
			outInfo[branchOffset + 0 + 0] = level + 0.25;
			outInfo[branchOffset + 0 + 1] = i;
			outInfo[branchOffset + 0 + 2] = treePositions[t][0];
			outInfo[branchOffset + 0 + 3] = treePositions[t][1];

			outInfo[branchOffset + 4 + 0] = level + 0.25;
			outInfo[branchOffset + 4 + 1] = i;
			outInfo[branchOffset + 4 + 2] = treePositions[t][0];
			outInfo[branchOffset + 4 + 3] = treePositions[t][1];

			outInfo[branchOffset + 8 + 0] = level + 0.25;
			outInfo[branchOffset + 8 + 1] = i;
			outInfo[branchOffset + 8 + 2] = treePositions[t][0];
			outInfo[branchOffset + 8 + 3] = treePositions[t][1];

			// top: equilateral triangle
			outInfo[branchOffset + 12 + 0] = level + 0.75;
			outInfo[branchOffset + 12 + 1] = i;
			outInfo[branchOffset + 12 + 2] = treePositions[t][0];
			outInfo[branchOffset + 12 + 3] = treePositions[t][1];

			outInfo[branchOffset + 16 + 0] = level + 0.75;
			outInfo[branchOffset + 16 + 1] = i;
			outInfo[branchOffset + 16 + 2] = treePositions[t][0];
			outInfo[branchOffset + 16 + 3] = treePositions[t][1];

			outInfo[branchOffset + 20 + 0] = level + 0.75;
			outInfo[branchOffset + 20 + 1] = i;
			outInfo[branchOffset + 20 + 2] = treePositions[t][0];
			outInfo[branchOffset + 20 + 3] = treePositions[t][1];

			if (i === nextLevelAfter) {
				level ++;
				branchesInThisLevel *= branchingFactor;
				nextLevelAfter += branchesInThisLevel;
			}
		}
	}

	return outInfo;
}

function branchTriangles (outIndices, nBranchesPerTree, nTrees) {

	for (var t = 0; t < nTrees; t++) {

		for (var i = 0; i < nBranchesPerTree; i++) {
			var branchOffset = t * nBranchesPerTree * 18 + i * 18;

			outIndices[branchOffset + 0 + 0] = 0 + i * 6 + t * nBranchesPerTree * 6;
			outIndices[branchOffset + 0 + 1] = 1 + i * 6 + t * nBranchesPerTree * 6;
			outIndices[branchOffset + 0 + 2] = 3 + i * 6 + t * nBranchesPerTree * 6;

			outIndices[branchOffset + 3 + 0] = 1 + i * 6 + t * nBranchesPerTree * 6;
			outIndices[branchOffset + 3 + 1] = 4 + i * 6 + t * nBranchesPerTree * 6;
			outIndices[branchOffset + 3 + 2] = 3 + i * 6 + t * nBranchesPerTree * 6;

			outIndices[branchOffset + 6 + 0] = 1 + i * 6 + t * nBranchesPerTree * 6;
			outIndices[branchOffset + 6 + 1] = 2 + i * 6 + t * nBranchesPerTree * 6;
			outIndices[branchOffset + 6 + 2] = 4 + i * 6 + t * nBranchesPerTree * 6;

			outIndices[branchOffset + 9 + 0] = 2 + i * 6 + t * nBranchesPerTree * 6;
			outIndices[branchOffset + 9 + 1] = 5 + i * 6 + t * nBranchesPerTree * 6;
			outIndices[branchOffset + 9 + 2] = 4 + i * 6 + t * nBranchesPerTree * 6;

			outIndices[branchOffset + 12 + 0] = 2 + i * 6 + t * nBranchesPerTree * 6;
			outIndices[branchOffset + 12 + 1] = 0 + i * 6 + t * nBranchesPerTree * 6;
			outIndices[branchOffset + 12 + 2] = 5 + i * 6 + t * nBranchesPerTree * 6;

			outIndices[branchOffset + 15 + 0] = 0 + i * 6 + t * nBranchesPerTree * 6;
			outIndices[branchOffset + 15 + 1] = 3 + i * 6 + t * nBranchesPerTree * 6;
			outIndices[branchOffset + 15 + 2] = 5 + i * 6 + t * nBranchesPerTree * 6;
		}
	}

	return outIndices;
}

const nBranchesPerTree = 1 + 4 + 16 + 64;
const treePositions = [
	//[0.25, 0.25],
	//[0.5, 0.25],
	//[0.75, 0.25],
	//[0.25, 0.5],
	//[0.5, 0.5],
	//[0.75, 0.5],
	//[0.25, 0.75],
	//[0.5, 0.75],
	//[0.75, 0.75]
];

var trees;

function loadTrees (levelData, width, height) {
	for (var x = 0; x < width; x++) {
		for (var y = 0; y < height; y++) {
			var green = levelData[(x + width * y) * 4 + 1];

			if (green === 255) {
				var position = [x / width, 1.0 - y / height];
				//console.log("found tree!", position);
				treePositions.push(position);
			}
		}
	}

	trees = new GLOW.Shader({
		vertexShader: loadSynchronous("shaders/trees.vert"),
		fragmentShader: loadSynchronous("shaders/trees.frag"),
		data: {
			vertices: branchVertices(new Float32Array(treePositions.length * nBranchesPerTree * 3 * 6), nBranchesPerTree, treePositions.length),
			info: branchInfo(new Float32Array(treePositions.length * nBranchesPerTree * 4 * 6), nBranchesPerTree, treePositions.length, 4),
			transform: new GLOW.Matrix4(),
			cameraInverse: camera.inverse,
			cameraProjection: camera.projection,
			terrainSize: new GLOW.Float(terrainSize),
			level: level,
			foliage: foliage.input
		},
		indices: branchTriangles(new Uint16Array(treePositions.length * nBranchesPerTree * 3 * 6), nBranchesPerTree, treePositions.length)
	});
}

function drawTrees () {
	if (trees){
		trees.uniforms.foliage.data = foliage.input;
		trees.draw();
	}
}