const levelImage = new Image();
levelImage.src = 'levels/0.png';

levelImage.onload = function () {
	loadLevel(levelImage);

	window.requestAnimationFrame(render);
};

