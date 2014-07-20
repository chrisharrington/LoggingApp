Logger.app.directive("modal", function() {
	return {
		restrict: "E",
		templateUrl: "templates/modal.html",
		transclude: true,
		scope: true,
		link: function(scope, element, attributes) {
			scope.title = attributes.header;
			scope.titleVisible = attributes.header !== undefined && attributes.header !== "";
			scope.className = attributes.class;
			scope.show = scope.$eval(attributes.show);

			scope.close = function() {
				scope.$eval(attributes.close)();
			};

			scope.$watch(attributes.show, function(value) {
				scope.show = value;
			});
		}
	}
});