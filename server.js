/*jshint esversion: 6 */
require('dotenv').config();
let exphbs = require("express-handlebars");
let bodyParser = require('body-parser');
let path = require('path');
var session = require('express-session');
var token;
var express = require("express"),
    app = express(),
    port = 3000;

var Slack = require("slack-node");
var slackApiToken = process.env['SLACK_API_TOKEN'];
const gitAPI = require("./webapi/gitAPI.js")(token);
var message = "new repo created";
var data = "DATA";
var hookmsg ='message: '+message+', data: '+data+'';
var slackUser = "ek222mw";
slack = new Slack(slackApiToken);

//send webhook to slack and user gets notification from the slackbot.
/*var slackAPI = require("./webapi/slackAPI.js")(slackApiToken);
slackAPI.postWebhook(slackUser, hookmsg).then(function(response)
{
  console.log(response);
});*/
require("./libs/helper").initialize();
app.engine(".hbs", exphbs({
    defaultLayout: "main",
    extname: ".hbs"
}));
app.set("view engine", ".hbs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));
app.use(function(req,res, next) {
  res.locals.token ="";
  res.locals.login = "";
  res.locals.orgs ="";
  next();
});
app.use(session({
    name:   "sessionforserver",
    secret: process.env['SESSION_SECRET'], // hide this variabel later
    saveUninitialized: false,
    resave: false,
    cookie: {
        secure: true,
        httpOnly: true,
        maxAge: 2000 * 60 * 60 * 24 // lives in 2 days
    }
}));

app.use("/", require("./routes/home.js"));
app.use("/slack", require("./routes/slack.js"));
app.use("/github", require("./routes/github.js"));




var server = app.listen(port, function() {
  console.log('Listening on port %d',port);
});
