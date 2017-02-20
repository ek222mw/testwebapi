let router = require("express").Router();

router.route("/")
    .get(function(req, res) {
      console.log("home");
      res.render("home/index");
});



module.exports = router;
