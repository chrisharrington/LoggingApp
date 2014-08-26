Logger.app.controller("logs", function(once, $rootScope, $scope, logRepository) {

	$rootScope.title = "Logs";

	$scope.logs = [];
	$scope.loading = true;

	logRepository.latest().then(function(logs) {
		$scope.loading = false;
		$scope.logs.pushAll(logs);
	});
});

Logger.app.factory("logs", function() {
	return {
		init: function() {

		},

		load: function() {
			
		}
	}
});