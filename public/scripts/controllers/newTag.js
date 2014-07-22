Logger.app.controller("new-tag", ["$scope", "$rootScope", function($scope, $rootScope) {
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
}]);