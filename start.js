const levelImage = new Image();
levelImage.src = 'levels/1.png';

levelImage.onload = function () {
	loadLevel(levelImage);

	window.requestAnimationFrame(render);
};

