
(function(root) {

	$(function() {
		Logger.Page.build({
			root: root,
			view: "new-log",
			route: "#/new-log",
			style: "new-log-container",
			isAnonymous: true
		});
	});

})(root("Logger.Welcome"));