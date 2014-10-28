var express = require('express');
var fs = require('fs');
var unzip = require('unzip');
var client = require('phonegap-build-api');
var router = express.Router();

/* GET users listing. */

router.post('/', function(req, res) {
    var fileOptions = req.files.decompress;
    var aliasFileName = fileOptions.name;
    var fileName = fileOptions.originalname;


    function phoneGapAuth() {

        client.auth({
            token: '-aNx9JXc5brk2rdg1z7m'
        }, function(e, api) {
            if (e) throw e;
              // time to make requests, on successful login
            phonegapAPI(api)
              
        });

    };

    function phonegapAPI(api) {

        var options = {
            form: {
                data: {
                    title: 'socialnetz',
                    create_method: 'file'
                },
                file: __outputPath + fileName
            }
        };
       

        api.post('/apps', options, function(e, data) {
            if (e) throw e;
            //once uploaded send the response back to UI
            complete()

        });
    };

    function complete() {
        res.send({
            msg: "success"
        });
    };

    

    //rename the file 
    fs.renameSync(__outputPath + aliasFileName, __outputPath + fileName);
    // connect with phonegap
    phoneGapAuth();


});



module.exports = router;