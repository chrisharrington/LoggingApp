Logger.app.factory("newLog", ["$rootScope", "once", function($rootScope, once) {
	var _measurements = [];
	var _tags = [];
	var _collections = [
		{ id: 1, name: "Exercise" },
		{ id: 2, name: "Milestones" },
		{ id: 3, name: "Maintenance" }
	];

	return {
		init: function(scope) {
			once("new-log-page", function() {
				$rootScope.$on("measurementAdded", function(event, args) {
					_measurements.push({ name: args.name, value: args.quantity + (args.units ? " " + args.units : "") });
				});

				$rootScope.$on("tagAdded", function(event, args) {
					_tags.push({ name: args.name });
				});
			});
		},

		load: function(scope) {
			scope.collections = {
				list: _collections
			};

			scope.measurements = {
				list: _measurements,
				add: function() {
					window.location.hash = "/new-log/measurement";
				}
			};

			scope.tags = {
				list: _tags,
				add: function() {
					window.location.hash = "/new-log/tag";
				}
			}
		}
	};
}]);