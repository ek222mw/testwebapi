let router = require("express").Router();

router.route("/callback")
    .get(function(req, res) {
      res.render("home/callback");
});

module.exports = router;
