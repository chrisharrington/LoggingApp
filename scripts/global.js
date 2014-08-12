function scope(selector) {
	var scope = angular.element($(selector)[0]).scope();
	console.log(scope);
	return scope;
}