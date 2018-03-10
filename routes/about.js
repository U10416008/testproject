var express = require('express');
var router = express.Router();
var url = require("url");
/* GET home page. */
router.get('/about', function(req, res) {
    var pathname = url.parse(req.url).pathname;
    res.render('about', { title: pathname });
});

module.exports = router;