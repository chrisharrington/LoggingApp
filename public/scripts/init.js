window.Logger = {
	app: angular.module("logger", ["ngRoute"]),
	virtualDirectory: "/"
};

Logger.app.config(["$interpolateProvider", function($interpolateProvider) {
	$interpolateProvider.startSymbol("[[");
	$interpolateProvider.endSymbol("]]");
}]);

Logger.app.config(["$routeProvider", function($routeProvider) {
	$routeProvider.when("/new-log", { templateUrl: "/new-log", controller: "new-log-controller" });
}]);

//(function (root) {
//
//	var _bar;
//
//	root.init = function () {
//		//_setupHighcharts();
//		_setupPath();
//		_setupRoutes();
//
//		Logger.SlideMenu.build($("section.menu"), $("#menu-trigger"));
//		document.cookie = "timezoneOffset=" + new Date().getTimezoneOffset();
//
//		$(document).on("keyup", function(e) {
//			if (e.keyCode == 27)
//				Logger.Dialog.hide();
//		});
//	};
//
//	function _setupPath() {
//		Path.root("#/logs");
//		Path.rescue(function () {
//			$("div.error404").show();
//			$("section.content-container").hide();
//		});
//		Path.listen();
//	}
//
//	function _setupHighcharts() {
//		Highcharts.setOptions({
//			colors: ["#D42C2C", "#2F7ED8", "#FA9141", "#1AADCE", "#8BBC21", "#0D233A"]
//		});
//	}
//
//	function _setupNanobar() {
//		_bar = new Nanobar({
//			bg: "#67CF53",
//			target: $("div.bar-container")[0]
//		});
//
//		$(document).ajaxSend(function () {
//			_bar.go(15);
//		}).ajaxComplete(function () {
//			_bar.go(100);
//		});
//	}
//
//	function _setupRoutes() {
//
//	}
//
//})(root("Logger.Init"));