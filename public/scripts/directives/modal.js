Logger.app.directive("modal", function() {
	return {
		restrict: "E",
		templateUrl: "templates/modal.html",
		transclude: true,
		link: {
			pre: function(scope, element, attributes) {
				scope.title = attributes.header;
				scope.className = attributes.class;
				scope.close = scope.$eval(attributes.close);
				scope.show = scope.$eval(attributes.show);

				scope.$watch(attributes.show, function(value) {
					scope.show = value;
					var divs = $(element).find(">div.modal, >div.modal-overlay");
					if (value) {
						divs.addClass("shown");
					} else {
						divs.removeClass("shown");
					}
				});
			}
		}
	}
});