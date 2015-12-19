// a file called 'util' is always a bad sign

function loadSynchronous (url) {
	var req = new XMLHttpRequest();
	req.open("GET", url + '?' + Math.floor(Math.random() * 100000), false);
	req.send(null);
	return (req.status == 200) ? req.responseText : null;
}

function gridVertices (gridSideLength) {
	const vertices = new Float32Array(3 * gridSideLength * gridSideLength);

	for (var y = 0; y < gridSideLength; y++) {
		for (var x = 0; x < gridSideLength; x++) {
			var i = 3 * (x + gridSideLength * y);
			vertices[i] = x / gridSideLength;
			vertices[i + 1] = y / gridSideLength;
			vertices[i + 2] = 0;
		}
	}

	return vertices;
}

function gridIndices (gridSideLength) {
	const indices = new Uint16Array(3 * 2 * (gridSideLength - 1) * (gridSideLength - 1));

	for (var y = 0; y < (gridSideLength - 1); y++) {
		for (var x = 0; x < (gridSideLength - 1); x++) {
			var i = 3 * 2 * (x + (gridSideLength - 1) * y);

			indices[i] =      x      +  y * (gridSideLength);
			indices[i + 1] = (x + 1) +  y * (gridSideLength);
			indices[i + 2] = (x + 1) + (y + 1) * (gridSideLength);

			indices[i + 3] = (x + 1) + (y + 1) * (gridSideLength);
			indices[i + 4] =  x      + (y + 1) * (gridSideLength);
			indices[i + 5] =  x      +  y * (gridSideLength);
		}
	}

	return indices;
}