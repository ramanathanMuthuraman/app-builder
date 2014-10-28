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
            getApp(api)

        });

    };

    function getApp(api) {
        api.get('/apps', function(e, data) {
            if (e) throw e;
            console.log('data:', data);
            if (data.apps.length) {
                deleteApp(api, data.apps[0].id)
            } else {
                postApp(api)
            }
        });
    }


    function deleteApp(api, id) {
        api.del('/apps/' + id, function(e, data) {
            console.log('error:', e);
            console.log('data:', data);
            postApp(api)
        });
    }

    function postApp(api) {

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
            console.log('data:', data);
            //once uploaded send the response back to UI
            buildApp(api, data.id)

        });
    };

    function buildApp(api, id) {

        var options = {
            form: {
                data: {
                    platforms: ['android', 'winphone']
                }
            }
        };

        api.post('/apps/' + id + '/build', options, function(e, data) {
            console.log('error:', e);
            console.log('data:', data);
            downloadApp(api, data.id);
        });

    };

    function downloadApp(api, id) {
        api.get('/apps/' + id + '/android').pipe(fs.createWriteStream(__outputPath + 'app.apk'));
        api.get('/apps/' + id + '/winphone').pipe(fs.createWriteStream(__outputPath + 'app.xap'));
        complete();



    };

    function complete(){
         res.send({
            "message": "finished"
        });
    }

    //rename the file 
    fs.renameSync(__outputPath + aliasFileName, __outputPath + fileName);
    // connect with phonegap
    phoneGapAuth();


});



module.exports = router;