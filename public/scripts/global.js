
$.ajaxSetup({ cache: false });

function namespace(space) {
	var root = window.Logger || (window.Logger = {});
	$(space.replace("Logger.", "").split(".")).each(function(i, part) {
		root[part] = root[part] || {};
		root = root[part];
	});
}

function root(location) {
	var parts = location.split(".");
	var root = window[parts[0]] || (window[parts[0]] = {});
	for (var i = 1; i < parts.length; i++) {
		root[parts[i]] = root[parts[i]] || (root[parts[i]] = {});
		root = root[parts[i]];
	}
	return root;
}

function inspect(o, isConsole) {
	var string = "";
	for (var name in o)
		string += name + ": " + o[name] + "\n";
	if (isConsole)
		console.log(string);
	else
		alert(string);
}

function scope(selector) {
	var scope = angular.element($(selector)[0]).scope();
	console.log(scope);
	return scope;
}

function ResolvedDeferred(data) {
	var deferred = new $.Deferred();
	deferred.resolve(data);
	return deferred.promise();
}