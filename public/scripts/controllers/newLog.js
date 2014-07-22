Logger.app.controller("new-log", ["$scope", "newLog", function($scope, newLog) {
	newLog.init($scope);
	newLog.load($scope);
}]);