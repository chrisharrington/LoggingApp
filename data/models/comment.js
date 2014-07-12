var mongoose = require("mongoose");
var objectId = mongoose.Schema.Types.ObjectId;

var schema = mongoose.Schema({
    isDeleted: { type: Boolean, default: false },
    date: { type: Date, default: Date.now },
    text: String,
    
    issue: { type: objectId, ref: "issue" },
    user: { type: objectId, ref: "user" }
});

schema.index({ issue: 1, isDeleted: 1 });

module.exports = require("bluebird").promisifyAll(mongoose.model("comment", schema));