Logger.app.controller("new-measurement", ["$scope", "$rootScope", function($scope, $rootScope) {
	$scope.name = "";
	$scope.quantity = "";
	$scope.units = "";

	$scope.add = function() {
		$rootScope.$emit("measurementAdded", {
			name: $scope.name,
			quantity: $scope.quantity,
			units: $scope.units
		});
		history.back();
	};
}]);