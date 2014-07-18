Logger.app.controller("new-log", ["$scope", function($scope) {
	$scope.collections = {
		list: [
			{ id: 1, name: "Exercise" },
			{ id: 2, name: "Milestones" },
			{ id: 3, name: "Maintenance" }
		]
	};

	$scope.measurements = {
		visible: false,
		show: function() { $scope.measurements.visible = true; },
		hide: function() { $scope.measurements.visible = false; },
		add: function() {
			_validateMeasurement();
		},
		list: [
			{ name: "distance", value: "2 km" }
		]
	};

	function _validateMeasurement() {
		var blah = $scope;
		debugger;
	}
}]);