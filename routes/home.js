
var router = require("express").Router();
var port = 3000;
var token;
var Org = require("../models/Org");
var gitAPI;
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

      res.render("home/index");
});

router.route("/login")
    .get(function(req, res) {

      console.log("started oauth");
      return githubOAuth.login(req, res);
});
router.route("/callback")
    .get(function(req, res) {
      console.log("received callback");
      return githubOAuth.callback(req, res);



});

githubOAuth.on('token', function(_token, serverResponse) {
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
        serverResponse.render("orgs/pick", {orgs:orgnames});
  });

});

router.route("/orgs")
  .get(function(req, res) {

    gitAPI = require("../webapi/gitAPI.js")(token);
    //console.log(gitAPI);
  gitAPI.getUser().then(function(user)
  {


    Org.findOne({username:user.login}, function(err, result)
    {
      if(result === null)
      {
        res.render("orgs/index", {error:"No org picked by user"});
      }
      else{


        gitAPI.getOneOrganizationRepos(result.org).then(function(response)
        {
          //console.log(response);

          var contxt = {

            items: response.map(function(item) {
              return {
                id: item.id,
                name: item.name,
                owner: item.owner.login,
                desc: item.description,
                link:item.html_url,
                dateCreated: item.created_at,
                dateUpdated: item.updated_at,
                forks:item.forks,
                openIssues: item.open_issues_count
              };
            }),
          };
          //console.log(contxt.items.length);
            //console.log(response[i].name);

          //console.log("contxt: "+contxt.items);
            res.render("orgs/index", {repos:contxt.items});
          });
        }
    });
  }).catch(function(err)
{
  res.render("orgs/index", {error:"Bad token or no token given"});
});



}).post(function(req,res)
  {
    //todo save org pick in database
    gitAPI = require("../webapi/gitAPI.js")(token);
    gitAPI.getUser().then(function(user)
    {
      //console.log("USER: "+user.login);
        Org.findOne({username:user.login, org:req.body.org}, function(err, result)
        {
          
          if(result === null)
          {
            var org = new Org({
              org: req.body.org,
              username: user.login
            });
          //saving user in db with mongoose command .save and send flash mess-
          org.save().then(function() {

          }).catch(function(error) {
            console.log(error.message);
            //res.render("users/register", {error: "Something went wrong with the registration"});
          });
          }

        });

    });

    gitAPI.getOneOrganizationRepos(req.body.org).then(function(response)
    {
      //console.log(response);
      var contxt = {

        items: response.map(function(item) {
          return {
            id: item.id,
            name: item.name,
            owner: item.owner.login,
            desc: item.description,
            link:item.html_url,
            dateCreated: item.created_at,
            dateUpdated: item.updated_at,
            forks:item.forks,
            openIssues: item.open_issues_count
          };
        }),
      };
      //console.log(contxt.items.length);
        //console.log(response[i].name);

      //console.log("contxt: "+contxt.items);
        res.render("orgs/index", {repos:contxt.items});
    });


  });





module.exports = router;
