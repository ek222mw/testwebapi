/*jshint esversion: 6 */
require('dotenv').config();
let exphbs = require("express-handlebars");
let bodyParser = require('body-parser');
let path = require('path');
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

app.engine(".hbs", exphbs({
    defaultLayout: "main",
    extname: ".hbs"
}));
app.set("view engine", ".hbs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", require("./routes/home.js"));
app.use("/slack/invite", require("./routes/slack.js"));

    /*app.use("/login", require("./routes/login.js"));
    app.use("/callback", require("./routes/callback.js"));
*/

var githubOAuth = require('github-oauth')({
  githubClient: process.env['GITHUB_CLIENT_ID'],
  githubSecret: process.env['GITHUB_CLIENT_SECRET'],
  baseURL: 'http://b7bab060.ngrok.io/:' + port,
  loginURI: '/login',
  callbackURI: '/callback',
  scope: 'read:org, user, repo, write:repo_hook, write:org, admin:org_hook'
});

app.get("/login", function(req, res){
  console.log("started oauth");
  return githubOAuth.login(req, res);
});

app.get("/callback", function(req, res){
  console.log("received callback");
  githubOAuth.callback(req, res);
  res.redirect("./");
});

githubOAuth.on('error', function(err) {
  console.error('there was a login error', err);
});

githubOAuth.on('token', function(_token, serverResponse) {

  token = _token.access_token;
  var gitAPI = require("./webapi/gitAPI.js")(token);
  gitAPI.getAllOrganizations().then(orgs => {
    console.log(orgs);
    serverResponse.end(JSON.stringify(_token));
  });

});

var server = app.listen(port, function() {
  console.log('Listening on port %d',port);
});
