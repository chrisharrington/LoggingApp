var mongoose = require("mongoose");
var objectId = mongoose.Schema.Types.ObjectId;

var schema = mongoose.Schema({
    name: String,
    isDeleted: { type: Boolean, default: false },
    emailAddress: String,
	phone: { type: String, default: "" },
    activationToken: String,
	salt: String,
	password: String,
	session: String,
	expiration: Date,
	newPasswordToken: String,

	emailNotificationForIssueAssigned: { type: Boolean, default: true },
	emailNotificationForIssueDeleted: { type: Boolean, default: false },
	emailNotificationForIssueUpdated: { type: Boolean, default: false },
	emailNotificationForNewCommentForAssignedIssue: { type: Boolean, default: false },
    
    project: { type: objectId, ref: "project" }
});

module.exports = require("bluebird").promisifyAll(mongoose.model("user", schema));