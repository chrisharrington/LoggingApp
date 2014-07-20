Logger.app.controller("new-measurement", ["$scope", "selectedLog", function($scope, selectedLog) {
	$scope.name = "";
	$scope.quantity = "";
	$scope.units = "";

	$scope.add = function() {
		_setDirty("measurementName", "measurementQuantity", "measurementUnits");
	};

	function _setDirty(arguments) {
		for (var i = 0; i < arguments.length; i++) {
			var name = arguments[i];
			$scope.form[name].$setViewValue($scope.form[name].$viewValue);
		}
	}
}]);