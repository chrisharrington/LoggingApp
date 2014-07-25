Logger.app.directive("modal", function() {
	return {
		restrict: "E",
		templateUrl: "templates/modal.html",
		transclude: true,
		scope: {
			title: "@header",
			className: "@class",
			close: "=",
			show: "="
		},
		link: function(scope, element, attributes) {
			scope.titleVisible = scope.title !== undefined && scope.title !== "";
		}
	}
});