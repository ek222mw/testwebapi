
var router = require("express").Router();
var port = 3000;
var token;
var Org = require("../models/Org");
var gitAPI;
var Notes = require("../models/Notifications.js");
var githubOAuth = require('github-oauth')({
  githubClient: process.env['GITHUB_CLIENT_ID'],
  githubSecret: process.env['GITHUB_CLIENT_SECRET'],
  baseURL: 'http://b7bab060.ngrok.io/:' + port,
  loginURI: '/login',
  callbackURI: '/callback',
  scope: 'read:org, user, repo, write:repo_hook, write:org, admin:org_hook'
});
var orgnames = [];

/*app.get("/login", function(req, res){

});

app.get("/callback", function(req, res){

});*/

githubOAuth.on('error', function(err) {
  console.error('there was a login error', err);
});



router.route("/")
    .get(function(req, res) {

      console.log("login bool "+res.app.locals.login);

      if(res.app.locals.login)
      {
        req.session.token = res.app.locals.token;
        req.session.login = res.app.locals.login;
        req.session.orgs = res.app.locals.orgs;
        //todo save org pick in database
        gitAPI = require("../webapi/gitAPI.js")(req.session.token);
        gitAPI.getUser().then(function(user)
        {
          //console.log("USER: "+user.login);
            Notes.findOne({username:user.login}, function(err, result)
            {

              if(result === null)
              {
                return res.render("home/index", {error:"Couldn't find notifications to that user"});
              }
              else{

                if(result.slack === true)
                {
                  console.log("TRUE");
                  res.render("home/index", {On: true});
                }
                else if(result.slack === false)
                {
                  console.log("FALSE");
                  res.render("home/index", {Off: true});
                }
              }



            });

        });
      }
      else{
        res.render("home/index");
      }


});

router.route("/login")
    .get(function(req, res) {

      console.log("started oauth");
      return githubOAuth.login(req, res);
});
router.route("/callback")
    .get(function(req, res) {
      return githubOAuth.callback(req, res);



});

githubOAuth.on('token', function(_token, res) {
  //console.log(_token);
  token = _token.access_token;

  gitAPI = require("../webapi/gitAPI.js")(token);
  gitAPI.getUser().then(function(user)
  {
    //console.log(user.login);
  });
  gitAPI.getAllOrganizations().then(orgs => {
        //console.log(orgs);
        var orgrepos = orgs[0].login;
        for(j=0; j<orgs.length; j++)
        {
          orgnames.push(orgs[j].login);
          //console.log(orgs[j].login);
        }
        res.app.locals.orgs = orgnames;
        res.app.locals.login = true;
        res.app.locals.token = token;
        var page = ("../");
        res.redirect(301,page);
  });

});

module.exports = router;
