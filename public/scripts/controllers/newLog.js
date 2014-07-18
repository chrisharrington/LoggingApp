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

		show: function() {
			$scope.measurements.visible = true;
		},

		hide: function(form) {
			$scope.measurements.visible = false;
			//$scope.measurements.new = {};
		},

		add: function(model) {
			if (model.$invalid)
				return;
		}
	};
}]);