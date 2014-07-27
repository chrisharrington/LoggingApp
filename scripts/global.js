function scope(selector) {
	var scope = angular.element($(selector)[0]).scope();
	console.log(scope);
	return scope;
}

window.onerror = function(msg, url, line, col, error) {
	var extra = !col ? '' : '\ncolumn: ' + col;
	extra += !error ? '' : '\nerror: ' + error;

	alert("Error: " + msg + "\nurl: " + url + "\nline: " + line + extra);
};