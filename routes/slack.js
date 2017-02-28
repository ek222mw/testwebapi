
var router = require("express").Router();
var slacktoken = process.env['SLACK_API_TOKEN'];
var slackAPI = require("../webapi/slackAPI.js")(slacktoken);
var gitAPI;
var Notes = require("../models/Notifications.js");

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

  router.route("/notificationStatus")
    .get(function(req,res)
    {




    }).post(function(req,res)
  {
    req.session.token = res.app.locals.token;
    if(!req.session.token)
    {
      return res.render("home/index", {error:"Please login to change notification status"});
    }

    if(req.body.optradio === 1)
    {
      req.body.optradio = true;
    }
    else if(req.body.optradio === 0)
    {
      req.body.optradio = false;
    }

    //todo save org pick in database
    gitAPI = require("../webapi/gitAPI.js")(req.session.token);
    gitAPI.getUser().then(function(user)
    {
      //console.log("USER: "+user.login);
        Notes.findOne({username:user.login}, function(err, result)
        {
          var notes;
          if(result === null)
          {
            console.log("new");
            notes = new Notes({
              slack: req.body.optradio,
              username: user.login
            });
          //saving user in db with mongoose command .save and send flash mess-
          notes.save().then(function() {

          }).catch(function(error) {
            console.log(error.message);
            //res.render("users/register", {error: "Something went wrong with the registration"});
          });
          }
          else{
            console.log("edit");
              result.slack = req.body.optradio;
              result.save().then(function()
            {

            }).catch(function(error)
            {
              console.log(error.message);
            });
          }

          if(req.body.optradio === true)
          {
            console.log("slack true: "+result.slack);
            res.render("partials/nav", {On: result.slack});
          }
          else if(req.body.optradio === true)
          {
            console.log("slack false "+result.slack);
            res.render("partials/nav", {Off: result.slack});
          }

        });

    });







  });

module.exports = router;
