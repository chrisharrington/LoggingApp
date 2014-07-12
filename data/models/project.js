var mongoose = require("mongoose");
var objectId = mongoose.Schema.Types.ObjectId;

var schema = mongoose.Schema({
	name: String,
	formattedName: String,
    isDeleted: { type: Boolean, default: false }
});

module.exports = require("bluebird").promisifyAll(mongoose.model("project", schema));