(function(root) {

	var _permissions;

	root.isAuthorized = function(tag) {
		if (!_permissions)
			_buildPermissionsDictionary();

		return Logger.signedInUser().permissions().exists(function(x) {
			return x.permissionId == _permissions[tag].id();
		});
	};

	function _buildPermissionsDictionary() {
		_permissions = {};
		$.each(Logger.permissions(), function(i, permission) {
			_permissions[permission.tag()] = permission;
		});
	}

})(root("Logger"));