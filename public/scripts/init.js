Logger.ANIMATION_SPEED = 250;

Logger.app.config(["$interpolateProvider", function($interpolateProvider) {
	$interpolateProvider.startSymbol("[[");
	$interpolateProvider.endSymbol("]]");
}]);

Logger.app.config(["$routeProvider", function($routeProvider) {
	$routeProvider
		.when("/logs", { templateUrl: "/logs", controller: "logs", reloadOnSearch: false })
		.when("/new-log", { templateUrl: "/views/newLog.html", controller: "new-log", reloadOnSearch: false })
		.when("/new-log/measurement", { templateUrl: "/views/newMeasurement.html", controller: "new-measurement" })
		.when("/new-log/tag", { templateUrl: "/views/newTag.html", controller: "new-tag" })
		.otherwise({ redirectTo: "/logs" });
}]);

Logger.app.run(function($rootScope) {
	var history = [];

	$rootScope.$on("$routeChangeStart", function (event, next, current) {
		if (history.length > 25)
			history.shift();
		history.push(window.location.hash);

		$rootScope.isBack = _isBack();
	});

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