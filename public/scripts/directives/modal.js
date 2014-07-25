Logger.app.directive("modal", function() {
	return {
		restrict: "E",
		templateUrl: "templates/modal.html",
		transclude: true,
		scope: {
			title: "@header",
			className: "@class",
			show: "=",
			close: "="
		},
		link: function(scope) {
			scope.titleVisible = scope.title !== undefined && scope.title !== "";
		}
	}
});