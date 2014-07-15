Logger.app.controller("header", function($scope) {
	$scope.test = "hello, world!";

	$scope.change = function() {
		$scope.test = "new!";
	}
});