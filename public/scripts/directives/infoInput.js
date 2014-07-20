Logger.app.directive("infoInput", ["$sce", function($sce) {
	return {
		restrict: "E",
		templateUrl: "templates/infoInput.html",
		scope: {
			placeholder: "@placeholder",
			type: "@type",
			name: "@name",
			bind: "="
		},
		link: function(scope, element, attributes) {
			scope.required = "blah";
			scope.info = $sce.trustAsHtml(attributes.info);
			scope.showing = false;

			scope.showModal = function() {
				scope.showing = true;
			};

			scope.hideModal = function() {
				scope.showing = false;
			};
		}
	}
}]);