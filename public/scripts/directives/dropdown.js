Logger.app.directive("dropdown", ["uuid", function(uuid) {
	return {
		restrict: "E",
		templateUrl: "templates/dropdown.html",
		scope: {
			options: "=options",
			placeholder: "@placeholder"
		},
		compile: function(e) {
			return function(scope, element, attributes) {
				var first = true;

				$(element).on("focus", "input", function() {
					$(element).find(">div").addClass("focus");
				});
				$(element).on("blur", "input", function() {
					$(element).find(">div").removeClass("focus");
				});

				scope.emptyAllowed = attributes.emptyAllowed === "";
				scope.visible = false;

				scope.show = function(event) {
					if ($(event.target).parents(".options-container").length == 0)
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
					first = false;

					$(window).on("resize", function() {
						scope.$apply(function() {
							scope.containerWidth = $(element).width();
						});
					});

					$(document).on("click", function (event) {
						scope.$apply(function() {
							if ($(event.target).parents("[dropdown-id='" + scope.id + "']").length == 0) {
								scope.hide();

								return false;
							}
						});
					});
				}

			}
		}
	}
}]);