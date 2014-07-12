var extend = require("node.extend");

var _initialized = false;

module.exports = function(key) {
	var config = {
		"databaseUser": "logging-app-user",
		"databaseLocation": "54.200.254.103:27017/logging-app",
		"hashAlgorithm": "sha512",
		"dateFormat": "YYYY-MM-DD",
		"dateTimeFormat": "YYYY-MM-DD HH:mm:ss",
		"storageName" : "leafissuetracker",
		"sendgridUsername": "LeafIssueTracker",
		"fromAddress": "no-reply@leafissuetracker.com",
		"domain": "http://www.leafissuetracker.com",
		"serverPort": 8080,
		"buildNumber": require("./package.json").version
	};

	if (!_initialized) {
		try {
			extend(config, require("./secureConfig.json"));
		} catch (e) {}

		for (var name in config)
			process.env["leaf." + name] = config[name];
		_initialized = true;
	}

	return process.env["leaf." + key];
};