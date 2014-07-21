Logger.app.directive("infoInput", ["$sce", function($sce) {
	return {
		restrict: "E",
		templateUrl: "templates/infoInput.html",
		scope: {
			placeholder: "@placeholder",
			type: "@type",
			name: "@name",
			ngModel: "="
		},
		compile: function (element) {
			if ($(element).attr("required"))
				$(element).find("input").prop("required", true);

			return function (scope, element, attributes) {
				scope.info = $sce.trustAsHtml(attributes.info);
				scope.showing = false;

				scope.showModal = function () {
					scope.showing = true;
				};

				scope.hideModal = function () {
					scope.showing = false;
				};
			}
		}
	}
}]);