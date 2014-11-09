var express = require('express');
var fs = require('fs');
var unzip = require('unzip');
var client = require('phonegap-build-api');
var archiver = require('archiver');
var router = express.Router();

/* GET users listing. */

router.post('/', function(req, res) {
    var fileOptions = req.files.decompress;
    var aliasFileName = fileOptions.name;
    var fileName = fileOptions.originalname;
    var appName = fileName.replace(".zip","");

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
            findPrivateApp(api,data)
            
        });
    }
    function findPrivateApp(api,data){

        /*find the private app and delete it, if present*/
            var privateApp = data.apps.filter(function( app ) {
                 if(app.private == true){
                    return app;
                 }
            });
            if (privateApp.length) {
                deleteApp(api, privateApp[0].id)
            } else {
                postApp(api)
            }

    }

    function deleteApp(api, id) {
        api.del('/apps/' + id, function(e, data) {
             if (e) throw e;
          
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
            if (e) throw e;
         
            complete(api);
        });

    };

   

    function complete(api){
         api.get('/apps', function(e, data) {
            if (e) throw e;
            var app_response = data.apps.filter(function( app ) {
                 if(app.private == true){
                    return app;
                 }
            });
            req.session.appName = appName; 
            req.session.appid = app_response[0].id; 
            app_response[0].platform = [{
                "type":"winphone",
                "extenstion" : ".xap"
            },{
                "type":"android",
                "extenstion" : ".apk"
            },{
                "type":"node-webkit",
                "extenstion" : ".nw"
            }]
            res.send(app_response);
        });
    };
    
    function cleanFolder() {
        /*Extract the archive*/
      
         /*set the name of the repackaged archive*/
        var nwfolder = __outputPath + appName + ".nw";
        var output = fs.createWriteStream(nwfolder);

        /*repackage the archive*/
        var zipArchive = archiver('zip');

        output.on('close', function() {

            //rename the file 
            fs.renameSync(__outputPath + aliasFileName, __outputPath + fileName);
            /*initiate phone gap auth process*/
            phoneGapAuth();
        });
       
        zipArchive.pipe(output);
        zipArchive.bulk([{
            src: ['**/*'],
            cwd: __outputPath + appName,
            expand: true
        }]);
        zipArchive.finalize(function(err, bytes) {

            if (err) {
                throw err;
            }
           

        });


    };

   /*Extract the zip folder*/
                fs.createReadStream(__outputPath + aliasFileName).pipe(unzip.Extract({
                    path: __outputPath
                }).on('close', cleanFolder));


});



module.exports = router;
