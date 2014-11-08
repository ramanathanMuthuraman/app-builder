$(document).ready(function() {

    $("body").on("click", ".download", downloadApp);


    // Check to see when a user has selected a file                                                                                                                
    function listApps(response) {
        var template = Handlebars.compile($("#app-built-template").html());
        $("#app-built").html(template(response[0]));
    }

    function appError(err) {
        console.log(err.status);
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


        $(this).ajaxSubmit({

            error: appError,

            success: function(response) {

                $('#uploadForm').resetForm();
                listApps(response);

                //TODO: We will fill this in later
            }
        });

        // Have to stop the form from submitting and causing                                                                                                       
        // a page refresh - don't forget this                                                                                                                      
        return false;
    });


    function downloadApp() {
        var type = $(this).closest(".platform").data("type");
        window.open("/download?type=" + type)


    }
});