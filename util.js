// a file called 'util' is always a bad sign

function loadSynchronous (url) {
	var req = new XMLHttpRequest();
	req.open("GET", url + '?' + Math.floor(Math.random() * 100000), false);
	req.send(null);
	return (req.status == 200) ? req.responseText : null;
}

function gridVertices () {
	const vertices = new Float32Array(3 * 256 * 256);

	for (var y = 0; y < 256; y++) {
		for (var x = 0; x < 256; x++) {
			var i = 3 * (x + 256 * y);
			vertices[i] = x - 128;
			vertices[i + 1] = y - 128;
			vertices[i + 2] = 0;
		}
	}

	return vertices;
}

function gridIndices () {
	const indices = new Uint16Array(3 * 2 * 255 * 255);

	for (var y = 0; y < 255; y++) {
		for (var x = 0; x < 255; x++) {
			var i = 3 * 2 * (x + 255 * y);

			indices[i] =      x      +  y * 256;
			indices[i + 1] = (x + 1) +  y * 256;
			indices[i + 2] = (x + 1) + (y + 1) * 256;

			indices[i + 3] = (x + 1) + (y + 1) * 256;
			indices[i + 4] =  x      + (y + 1) * 256;
			indices[i + 5] =  x      +  y * 256;
		}
	}

	return indices;
}