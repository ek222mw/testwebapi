
var router = require("express").Router();
var slacktoken = process.env['SLACK_API_TOKEN'];
var slackAPI = require("../webapi/slackAPI.js")(slacktoken);

router.route("/")
  .get(function(req,res)
  {
    res.render("slack/invite");
  }).post(function(req,res)
  {
    var email = req.body.email;
    slackAPI.postInviteTeam(email).then(function(response) {

      var content = JSON.parse(response);

      if(content.ok === false)
      {
        res.render("slack/invite", {error:"Error user have already been invited"});
      }
      else{
        res.render("home/index", {success:"Invite successfully sent"});
      }

    });


  });

module.exports = router;
