Logger.app.directive("checkbox", function() {
	return {
		restrict: "E",
		templateUrl: "templates/checkbox.html",
		transclude: true,
		scope: {
			checked: "="
		},
		link: function(scope) {
			scope.toggle = function() {
				scope.checked = !scope.checked;
			};
		}
	};
});