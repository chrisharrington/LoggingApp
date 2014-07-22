Logger.app.controller("new-log", ["$scope", "$rootScope", "once", "measurementRepository", function($scope, $rootScope, once, measurementRepository) {
	once("new-log", function() {
		$rootScope.$on("measurementAdded", function(event, args) {
			$scope.measurements.list.push({ name: args.name, value: args.quantity + (args.units ? " " + args.units : "") });
		});
	});

	measurementRepository.log(null).then(function (measurements) {
		for (var i = 0; i < measurements.length; i++) {
			var measurement = measurements[i];
			$scope.measurements.list.push({ name: measurement.name, value: measurement.quantity + (measurement.units ? " " + measurement.units : "") });
		}
	});

	$scope.collections = {
		list: [
			{ id: 1, name: "Exercise" },
			{ id: 2, name: "Milestones" },
			{ id: 3, name: "Maintenance" }
		]
	};

	$scope.measurements = {
		add: function() {
			window.location.hash = "/new-log/measurement";
		}
	};
}]);