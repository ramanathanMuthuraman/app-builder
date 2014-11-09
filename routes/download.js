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
	platform['node-webkit'] = ".nw";
	
  	
  	if(type === "android" || type === "winphone")
  	res.redirect("https://build.phonegap.com/api/v1/apps/"+req.session.appid+"/"+type);
  	else
	res.download(__outputPath + appName + platform[type]);
 

});



module.exports = router;
