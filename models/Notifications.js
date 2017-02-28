var mongoose = require("mongoose");

var notesSchema = mongoose.Schema({
  slack: { type: Boolean, required: true, default:true },
  github: { type: Boolean, required: true, default:true },
  username: {type: String, required: true, unique:true}
});


var Notification = mongoose.model("Notification", notesSchema);
module.exports = Notification;
