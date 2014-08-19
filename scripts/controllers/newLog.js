Logger.app.controller("new-log", ["$scope", "newLog", function($scope, newLog) {
	newLog.init($scope);
	newLog.load($scope);
}]);

Logger.app.factory("newLog", function($rootScope, $timeout, once, feedback, collectionRepository) {
	var _measurements = [];
	var _tags = [];
	var _validating = false;

	return {
		init: function() {
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
			$rootScope.title = "New Log";

			scope.name = "";
			scope.collection = "";
			scope.location = true;
			scope.nameError = false;

			scope.getCollections = collectionRepository.contains;

			scope.save = function() {
				if (!_validate())
					return;

				feedback.message("boogity");
			};

			scope.saveAndAdd = function() {
				scope.save();
			};

			scope.clearFeedback = function() {
				if (!_validating)
					feedback.hide();

				_validating = false;
			};

			scope.$on("onNameError", function(event, message) {
				feedback.message(message);
				scope.nameError = true;
			});

			function _validate() {
				_validating = true;
				if (!scope.name || scope.name == "")
					return !scope.$broadcast("onNameError", "The name is required.");
			}
		}
	};
});