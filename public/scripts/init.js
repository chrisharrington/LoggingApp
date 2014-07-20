Logger.app.config(["$interpolateProvider", function($interpolateProvider) {
	$interpolateProvider.startSymbol("[[");
	$interpolateProvider.endSymbol("]]");
}]);

Logger.app.config(["$routeProvider", function($routeProvider) {
	$routeProvider
		.when("/logs", { templateUrl: "/logs", controller: "logs" })
		.when("/new-log", { templateUrl: "/new-log", controller: "new-log" })
		.when("/new-log/measurement", { templateUrl: "/new-measurement", controller: "new-measurement" })
		.otherwise({ redirectTo: "/logs" });
}]);

Logger.ANIMATION_SPEED = 25000;