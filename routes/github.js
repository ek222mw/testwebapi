var router = require("express").Router();
var port = 3000;
var token;
var Org = require("../models/Org");
var gitAPI;


router.route("/pickorg")
  .get(function(req, res) {
    req.session.login = res.app.locals.login;
    if(req.session.login)
    {
      req.session.orgs = res.app.locals.orgs;
      res.render("orgs/pick", {orgs:req.session.orgs});
    }
    else{
      res.render("home/index", {error:"Error! Please login with github to get a organisation to pick"});
    }


  });


router.route("/orgs")
  .get(function(req, res) {
    req.session.login = res.app.locals.login;
    if(!req.session.login)
    {
      return res.render("home/index", {error:"Error! Please login to see details in organisation"});
    }
    req.session.token = res.app.locals.token;
    gitAPI = require("../webapi/gitAPI.js")(req.session.token);
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
  res.render("orgs/index", {error:"Bad token or no token given in Github Oauth"});
});



}).post(function(req,res)
  {
    req.session.token = res.app.locals.token;
    //todo save org pick in database
    gitAPI = require("../webapi/gitAPI.js")(req.session.token);
    gitAPI.getUser().then(function(user)
    {
      //console.log("USER: "+user.login);
        Org.findOne({username:user.login}, function(err, result)
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
          else{
              result.org = req.body.org;
              result.save().then(function()
            {

            }).catch(function(error)
            {
              console.log(error.message);
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
