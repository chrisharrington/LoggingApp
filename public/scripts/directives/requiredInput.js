Logger.app.directive("requiredInput", function() {
	return {
		restrict: "E",
		templateUrl: "templates/requiredInput.html",
		link: function(scope, element, attributes) {
			scope.type = attributes.type;

			scope.name = "name";
			scope.model = {};

			scope.focus = function() {
				$(element).find("input").focus();
			};
		}
	}
});