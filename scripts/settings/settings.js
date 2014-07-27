(function(root) {

	var _menu;

	root.init = function(container) {
		_menu = Logger.SlideMenu.build(container);
	};

	root.show = function() {
		_menu.show();
	};

})(root("Logger.Settings"));