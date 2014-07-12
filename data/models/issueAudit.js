var mongoose = require("mongoose");
var objectId = mongoose.Schema.Types.ObjectId;

var schema = mongoose.Schema({
    isDeleted: { type: Boolean, default: false },
    date: Date,
    
    issue: { type: objectId, ref: "issue" },
    user: { type: objectId, ref: "user" }
});

module.exports = require("bluebird").promisifyAll(mongoose.model("issue-audit", schema));