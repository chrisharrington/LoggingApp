Logger.app.directive("spinner", function() {
	return {
		restrict: "E",
		templateUrl: "templates/spinner.html",
		scope: {
			colour: "@",
			borderWidth: "@",
			size: "@"
		},
		link: function(scope) {
			scope.colour = scope.colour || "#2196F3";
			scope.borderWidth = scope.borderWidth || "2px";
			scope.size = scope.size || "32px";
		}
	};
});