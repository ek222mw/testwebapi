/*jshint esversion:6*/
//setting up schema to communicate with mongodb through mongoose. this item schema which is infact snippets in view.
let mongoose = require("mongoose");

let orgSchema = mongoose.Schema({
  org: { type: String, required: true },
  username: {type: String, required: true, unique:true,}
});


let Org = mongoose.model("Org", orgSchema);
module.exports = Org;
