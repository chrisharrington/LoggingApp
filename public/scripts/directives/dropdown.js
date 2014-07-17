Logger.app.directive("dropdown", ["uuid", function(uuid) {
	return {
		restrict: "E",
		templateUrl: "templates/dropdown.html",
		scope: {
			options: "=options"
		},
		compile: function(e) {
			return function(scope, element, attributes) {
				var first = true;

				scope.placeholder = attributes.placeholder;
				scope.visible = false;

				scope.show = function(event) {
					if ($(event.target).parents("[option]").length == 0)
						scope.visible = true;
				};

				scope.hide = function() {
					scope.visible = false;
				};

				scope.select = function(option) {
					scope.hide();
					scope.selected = option.name;
					scope.selectedId = option.id;
				};

				scope.containerWidth = $(element).width();

				if (first) {
					scope.id = uuid.create();

					$(window).on("resize", function() {
						scope.$apply(function() {
							scope.containerWidth = $(element).width();
						});
					});

					$(document).on("click", function (event) {
						scope.$apply(function() {
							if ($(event.target).parents("[dropdown-id='" + scope.id + "']").length == 0)
								scope.visible = false;
						});
					});
					first = false;
				}

			}
		}
	}
}]);