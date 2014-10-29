var express = require('express');
var fs = require('fs');
var client = require('phonegap-build-api');
var router = express.Router();

/* GET users listing. */

router.get('/', function(req, res) {

	var type = req.query.type;
	var platform = [];
	var appName = req.session.appName;
	platform['android'] = ".apk";
	platform['winphone'] = ".xap";
	platform['desktop'] = ".nw";
	
  	
  	res.download(__outputPath + appName + platform[type]);
 

});



module.exports = router;