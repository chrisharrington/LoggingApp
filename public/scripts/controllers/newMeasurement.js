Logger.app.controller("new-measurement", ["$scope", "$rootScope", "$timeout", function($scope, $rootScope, $timeout) {
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

	$scope.cancel = function() {
		//history.back();
		$rootScope.$broadcast("newMeasurementLoaded");
	};

	$timeout(function() {
		$rootScope.$broadcast("newMeasurementLoaded");
	}, 100);
}]);