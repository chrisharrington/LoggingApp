Logger.app.config(["$interpolateProvider", function($interpolateProvider) {
	$interpolateProvider.startSymbol("[[");
	$interpolateProvider.endSymbol("]]");
}]);

Logger.app.config(["$routeProvider", function($routeProvider) {
	$routeProvider
		.when("/logs", { templateUrl: "/logs", controller: "logs", reloadOnSearch: false })
		.when("/new-log", { templateUrl: "/new-log", controller: "new-log", reloadOnSearch: false })
		.when("/new-log/measurement", { templateUrl: "/new-measurement", controller: "new-measurement", reloadOnSearch: false })
		.otherwise({ redirectTo: "/logs" });
}]);

Logger.ANIMATION_SPEED = 250;