Logger.app.directive("dropdown", function() {
	return {
		restrict: "E",
		templateUrl: "templates/dropdown.html",
		scope: {
			options: "=options",
		},
		link: function(scope, element, attributes) {
			scope.placeholder = attributes.placeholder;
			scope.visible = false;

			scope.show = function() {
				scope.visible = true;
			};

			scope.hide = function() {
				scope.visible = false;
			};



			$(element).find(">div>div>div").width($(element).width());
		}
	}
});