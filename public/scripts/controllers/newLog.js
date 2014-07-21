Logger.app.controller("new-log", ["$scope", "$rootScope", "measurementRepository", function($scope, $rootScope, measurementRepository) {
	measurementRepository.log(null).then(function(measurements) {
		var list = [];
		for (var i = 0; i < measurements.length; i++) {
			var measurement = measurements[i];
			list.push({ name: measurement.name, value: measurement.quantity + (measurement.units ? " " + measurement.units : "") });
		}
		$scope.measurements.list = list;
	});

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
		add: function() {
			window.location.hash = "/new-log/measurement";
		}
	};

	$rootScope.$on("measurementAdded", function(event, args) {
		$scope.measurements.list.push({ name: args.name, value: args.quantity + (args.units ? " " + args.units : "") });
	});
}]);