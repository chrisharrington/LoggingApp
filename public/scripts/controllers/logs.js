
(function(root) {

	$(function() {
		Logger.Page.build({
			root: root,
			view: "logs",
			controller: "logs",
			route: "#/logs",
			style: "logs-container",
			isAnonymous: true
		});
	});

})(root("Logger.Logs"));