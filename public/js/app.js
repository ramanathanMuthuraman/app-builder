$(document).ready(function() {

    $("body").on("click", ".type", downloadApp);

    status('Choose a file :)');

    // Check to see when a user has selected a file                                                                                                                
    function listApps(response) {
        console.log(response);
        var template = Handlebars.compile($("#app-built-template").html());
        $("#app-built").html(template(response));
    }

    function appError(err) {
        $('#status').text(err.status);
    }
    $("#archiveFolder").click(function() {

        var timerId = setInterval(function() {
            if ($('#archiveFolder').val() !== '') {
                clearInterval(timerId);

                $('#uploadForm').submit();
            }
        }, 500);
    })


    $('#uploadForm').submit(function() {
        status('uploading the file ...');

        $(this).ajaxSubmit({

            error: appError,

            success: function(response) {
                $('#status').text("upload completed successfully");
                $('#uploadForm').resetForm();
                listApps(response);

                //TODO: We will fill this in later
            }
        });

        // Have to stop the form from submitting and causing                                                                                                       
        // a page refresh - don't forget this                                                                                                                      
        return false;
    });

    function status(message) {

    }

    function downloadApp() {
        var type = $(this).data("type");
        window.open("/download?type=" + type)


    }
});