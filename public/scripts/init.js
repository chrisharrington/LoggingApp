
(function (root) {

	var _bar;

	root.init = function () {
		_setupHighcharts();
		//_setupNanobar();
		_setupPath();

		document.cookie = "timezoneOffset=" + new Date().getTimezoneOffset();

		$(document).on("keyup", function(e) {
			if (e.keyCode == 27)
				Logger.Dialog.hide();
		});
	};
	
	function _setupPath() {
		Path.root("#/logs");
		Path.rescue(function () {
			$("div.error404").show();
			$("section.content-container").hide();
		});
		Path.listen();
	}

	function _setupHighcharts() {
		Highcharts.setOptions({
			colors: ["#D42C2C", "#2F7ED8", "#FA9141", "#1AADCE", "#8BBC21", "#0D233A"]
		});
	}

	function _setupNanobar() {
		_bar = new Nanobar({
			bg: "#67CF53",
			target: $("div.bar-container")[0]
		});
		
		$(document).ajaxSend(function () {
			_bar.go(15);
		}).ajaxComplete(function () {
			_bar.go(100);
		});
	}

})(root("Logger.Init"));