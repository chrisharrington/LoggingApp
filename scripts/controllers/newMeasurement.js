Logger.app.controller("new-measurement", function($scope, $rootScope, $timeout, feedback) {
	$scope.name = "";
	$scope.quantity = "";
	$scope.units = "";

	$scope.add = function() {
		if (!_validate())
			return;

		$rootScope.$emit("measurementAdded", {
			name: $scope.name,
			quantity: $scope.quantity,
			units: $scope.units
		});
		history.back();
	};

	$scope.cancel = function() {
		history.back();
	};

	$timeout(function() {
		$rootScope.$broadcast("newMeasurementLoaded");
	}, 100);

	function _validate() {
		var error;
		if ($scope.form.name.$error.required)
			error = "The name is required.";
		else if (!$scope.form.quantity.$valid) {
			if ($scope.quantity == "")
				error = "The quantity is required.";
			else
				error = "The quantity is invalid.";
		}
		if (error) {
			feedback.message(error);
			return false;
		} else {
			feedback.hide();
			return true;
		}
	}
});