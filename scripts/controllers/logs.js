Logger.app.controller("logs", function($scope, once, logs) {
	logs.load($scope);
});

Logger.app.factory("logs", function($rootScope, logRepository) {
	var _logs = [];

	$rootScope.$on("onLogAdded", _getLogs);

	_getLogs();

	function _getLogs() {
		scope.loading = true;
		logRepository.latest().then(function (logs) {
			scope.loading = false;
			_logs = [];
			_logs.pushAll(logs);
		});
	}

	return {
		load: function(scope) {
			scope.logs = _logs;
			$rootScope.title = "Logs";
		}
	}
});