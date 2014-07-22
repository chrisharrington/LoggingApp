Logger.app.directive("focus", function() {
	return function(scope, element, attributes) {
		scope.$on(attributes.focus, function() {
			//debugger;
			$(element).focus();
		});
	};
});