Logger.app.controller("new-tag", function($scope, $rootScope, $timeout) {
	$scope.name = "";

	$scope.add = function() {
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
});