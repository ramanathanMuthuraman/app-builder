var express = require('express');
var fs      = require('fs');
var unzip   = require('unzip');
var router = express.Router();

/* GET users listing. */

router.post('/', function(req, res) {

	var outputPath =__base+"public/result/";
	var zipFolder= req.files.decompress.name;
    var unzippedFolder = zipFolder.replace(".zip","");
	fs.rename(req.files.decompress.path,outputPath+zipFolder,function(err){
		if(err) 
			return;
        fs.createReadStream(outputPath+zipFolder).pipe(unzip.Extract({ path: outputPath+unzippedFolder }).on('close',function(){
          res.send({
		path: outputPath+unzippedFolder
            });
        }));
		
	});
	
});

module.exports = router;
