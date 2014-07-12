var Promise = require("bluebird");

var directory = "./caches/";
module.exports = {
	User: require(directory + "userCache")
};