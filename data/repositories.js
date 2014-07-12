var Promise = require("bluebird");

var directory = "./repositories/";
var repositories = {
	User: require(directory + "userRepository")
};

module.exports = repositories;