Logger.app.controller("new-log", ["$scope", "newLog", function($scope, newLog) {
	newLog.init($scope);
	newLog.load($scope);
}]);

Logger.app.factory("newLog", function($rootScope, once, feedback, collections) {
	var _measurements = [];
	var _tags = [];

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
			scope.name = "";
			scope.collection = {};
			scope.location = true;

			scope.getCollections = collections.contains;

			scope.measurements = {
				list: _measurements,
				add: function() {
					window.requestAnimationFrame(function() {
						window.location.hash = "/new-log/measurement";
					});
				}
			};

			scope.tags = {
				list: _tags,
				add: function() {
					window.location.hash = "/new-log/tag";
				}
			};

			scope.save = function() {
				if (!_validate())
					return;

				feedback.message("boogity");
			};
		}
	};
});