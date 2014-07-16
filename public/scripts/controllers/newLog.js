Logger.app.controller("new-log", ["$scope", function($scope) {
	$scope.collections = {
		list: [
			{ name: "Exercise" },
			{ name: "Milestones" },
			{ name: "Maintenance" }
		]
	};

	$scope.measurements = {
		visible: false,
		show: function() { $scope.measurements.visible = true; },
		hide: function() { $scope.measurements.visible = false; },
		list: [
			{ name: "distance", value: "2 km" }
		]
	};
}]);