var express = require("express");
var router = express.Router();

/* GET home page. */
router.use("/auth", require("./authRoutes"));

module.exports = router;
