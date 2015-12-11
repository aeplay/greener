// a file called 'util' is always a bad sign

var loadSynchronous = function(url) {
	var req = new XMLHttpRequest();
	req.open("GET", url + '?' + Math.floor(Math.random() * 100000), false);
	req.send(null);
	return (req.status == 200) ? req.responseText : null;
};