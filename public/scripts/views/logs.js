
(function(root) {

	$(function() {
		IssueTracker.Page.build({
			root: root,
			view: "logs",
			route: "#/logs",
			style: "logs-container",
			isAnonymous: true
		});
	});

})(root("Logger.Welcome"));