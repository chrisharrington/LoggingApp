var mongoose = require("mongoose");
var objectId = mongoose.Schema.Types.ObjectId;

var schema = mongoose.Schema({
    name: String,
    isDeleted: { type: Boolean, default: false },
    
    project: { type: objectId, ref: "project" },
});

module.exports = require("bluebird").promisifyAll(mongoose.model("issue-type", schema));