Logger.app.controller("newLog", function($scope, once, newLog) {
	newLog($scope);
});

Logger.app.factory("newLog", function($rootScope, $timeout, feedback, collectionRepository, logRepository, $q) {
	var _validating = false;

	return function(scope) {
		$rootScope.title = "New Log";

		scope.name = "";
		scope.collection = "";
		scope.location = true;
		scope.nameError = false;

		scope.getCollections = collectionRepository.contains;

		scope.save = function() {
			_save().then(function() {
				window.location.hash = "logs";
			});
		};

		scope.saveAndAdd = function() {
			_save().then(function() {
				alert("add entry");
			})
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
			return true;
		}

		function _save() {
			var deferred = $q.defer();
			if (_validate()) {
				$rootScope.loading = true;
				logRepository.insert({
					name: scope.name,
					collectionName: scope.collection,
					location: scope.location
				}).then(function(log) {
					deferred.resolve(log);
					$rootScope.$broadcast("onLogAdded", log);
				}).catch(function() {
					feedback.message("An error occurred while adding your log. Please try again later.");
				}).finally(function() {
					$rootScope.loading = false;
				});
			}
			return deferred.promise;
		}
	}
});