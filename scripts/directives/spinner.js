Logger.app.directive("spinner", function() {
	return {
		restrict: "E",
		templateUrl: "templates/spinner.html",
		scope: {
			colour: "@",
			borderWidth: "@",
			size: "@",
			backgroundColour: "@"
		}
	};
});