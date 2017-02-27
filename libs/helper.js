/* jshint esversion:6 */

let mongoose = require("mongoose");
mongoose.Promise = require('bluebird');

//from: https://github.com/1dv023/syllabus/blob/master/lectures/03/demo/libs/dbHelper.js
//mongodb database initialization.
module.exports = { initialize : function()
{

  let getDBconf = require("../config/database.js");
  let database = mongoose.connection;

  database.on("error", console.error.bind(console, "connection error:"));

  database.once("open", function()
  {
    console.log("connected to mongoDB");
  });

  process.on("SIGINT", function() {
      database.close(function() {
          console.log("Mongoose connection disconnected through app termination.");
          process.exit(0);
      });
  });


   mongoose.connect(getDBconf.conString,function()
   {

   });
}

};
