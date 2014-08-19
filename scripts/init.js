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
		.otherwise({ redirectTo: "/logs" });
}]);

Logger.app.run(function($rootScope, collectionRepository, logRepository, $q, menu) {
	$rootScope.title = "";
	$rootScope.user = {
		email: "chrisharrington99@gmail.com"
	};

	menu.init();

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
});

