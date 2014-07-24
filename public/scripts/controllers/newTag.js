Logger.app.controller("new-tag", function($scope, $rootScope, $timeout, feedback) {
	$scope.name = "";

	$scope.add = function() {
		if (!_validate())
			return;

		$rootScope.$emit("tagAdded", {
			name: $scope.name
		});
		history.back();
	};

	$scope.cancel = function() {
		history.back();
	};

	$timeout(function() {
		$rootScope.$broadcast("newTagLoaded");
	}, 100);

	function _validate() {
		var error;
		if ($scope.form.name.$error.required)
			error = "The name is required.";

		if (error) {
			feedback.message(error);
			return false;
		} else {
			feedback.hide();
			return true;
		}
	}
});