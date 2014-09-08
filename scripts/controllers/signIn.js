Logger.app.controller("sign-in", function($scope, once, signIn) {
	once("sign-in", function() {
		signIn.init($scope);
	});
	signIn.load($scope);
});

Logger.app.factory("signIn", function($rootScope, authentication, feedback) {
	var _scope;

	return {
		init: function(scope) {
			_scope = scope;
			scope.emailAddress = "";
			scope.password = "";
			scope.loading = false;

			scope.signIn = _signIn;
		},

		load: function(scope) {
			if ($rootScope.user)
				window.location.hash = "logs";
		}
	};

	function _signIn() {
		if (_validate()) {
			feedback.hide();
			$rootScope.loading = true;
			authentication.signIn(_scope.emailAddress, _scope.password).then(function (authenticated) {
				if (authenticated)
					window.location.hash = "logs";
				else
					feedback.message("Invalid credentials.");
			}).catch(function () {
				feedback.message("An error has occurred while signing you in. Please try again later.");
			}).finally(function() {
				$rootScope.loading = false;
			});
		}
	}

	function _validate() {
		var error;

		if (!_scope.emailAddress || _scope.emailAddress === "")
			error = "The email address is required.";
		else if (!_scope.password || _scope.password === "")
			error = "The password is required.";

		if (error !== undefined)
			feedback.message(error);
		return error === undefined;
	}
});