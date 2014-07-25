Logger.app.directive("autocomplete", function() {
	var first = true;

	return {
		restrict: "E",
		templateUrl: "templates/autocomplete.html",
		scope: {
			placeholder: "@",
			get: "=",
			value: "=",
			ngModel: "=",
			tabindex: "@"
		},
		link: function(scope, element, attributes) {
			if (first) {
				var input = $(element).find("input");
				input.on("keyup", function () {
					if (input.val() == "") {
						scope.$apply(function() {
							scope.visible = false;
							scope.results = [];
						});
					} else {
						scope.get(input.val()).then(function (results) {
							scope.visible = results.length > 0;
							scope.results = results;
						});
					}
				});

				$(window).on("resize", function() {
					scope.$apply(function() {
						scope.containerWidth = $(element).width();
					});
				});
			}

			first = false;
			scope.visible = true;
			scope.containerWidth = $(element).width();

			scope.select = function(result) {
				scope.visible = false;
				scope.ngModel.id = result.id;
				scope.ngModel.name = result.name;
			}
		}
	}
});