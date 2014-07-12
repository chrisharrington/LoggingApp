
(function(root) {

	root.user = ko.observable();
	root.loading = ko.observable(false);

	root.reset = function (user) {
		root.user(user);
		IssueTracker.Dialog.load("confirm-reset-password-template", root);
	};

	root.confirm = function () {
		root.loading(true);
		$.post(IssueTracker.virtualDirectory + "users/reset-password", { userId: root.user().id() }).done(function() {
			IssueTracker.Feedback.success(root.user().name() + " has been sent a password reset email.");
			IssueTracker.Dialog.hide();
		}).fail(function() {
			IssueTracker.Feedback.error("An error has occurred while sending the password reset email. Please try again later.");
		}).always(function() {
			root.loading(false);
		});
	};

	root.cancel = function() {
		IssueTracker.Dialog.hide();
	};

})(root("IssueTracker.Users.ResetPassword"));