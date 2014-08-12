Logger.ANIMATION_SPEED = 250;

Logger.app.config(["$interpolateProvider", function($interpolateProvider) {
	$interpolateProvider.startSymbol("[[");
	$interpolateProvider.endSymbol("]]");
}]);

Logger.app.config(["$routeProvider", function($routeProvider) {
	$routeProvider
		.when("/logs", { templateUrl: "views/logs.html", controller: "logs" })
		.when("/new-log", { templateUrl: "views/newLog.html", controller: "new-log" })
		.when("/new-log/measurement", { templateUrl: "views/newMeasurement.html", controller: "new-measurement" })
		.when("/new-log/tag", { templateUrl: "views/newTag.html", controller: "new-tag" })
		.otherwise({ redirectTo: "/new-log" });
}]);

Logger.app.run(function($rootScope, collectionRepository, logRepository, $q) {
	var history = [];

	$rootScope.menuVisible = false;

	$rootScope.showMenu = function() {
		$rootScope.menuVisible = true;
	};

	$rootScope.hideMenu = function() {
		$rootScope.menuVisible = false;
	};

	$rootScope.$on("$routeChangeStart", function (event, next, current) {
		_handleBack();
	});

	$q.all([_loadCollections(), _loadLogs()]).then(function(result) {
		var collections = result[0], logs = result[1];
		for (var i = 0; i < collections.length; i++) {
			for (var j = 0; j < logs.length; j++) {
				if (collections[i].id == logs[j].collectionId) {
					if (!collections[i].logs)
						collections[i].logs = [];
					collections[i].logs.push(logs[j]);
				}
			}
		}

		$rootScope.collections = collections;
	});

	function _loadCollections() {
		return collectionRepository.all();
	}

	function _loadLogs() {
		return logRepository.all().then(function(logs) {
			$rootScope.logs = logs;
			return logs;
		});
	}

	function _handleBack() {
		if (history.length > 25)
			history.shift();
		history.push(window.location.hash);

		$rootScope.isBack = _isBack();
	}

	function _isBack() {
		if (!history || history.length < 3)
			return false;

		var isBack = history[history.length-1] === history[history.length-3];
		if (isBack) {
			history.pop();
			history.pop();
		}
		return isBack;
	}
});

