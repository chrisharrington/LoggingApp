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
		new: {},
		list: [{ name: "distance", value: "2 km" }],

		add: function() {
			window.location.hash = "/new-log/measurement";
		}
	};

}]);