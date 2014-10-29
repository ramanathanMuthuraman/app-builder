$(document).ready(function() {
    
    $("body").on("click",".type",downloadApp);

    status('Choose a file :)');
 
    // Check to see when a user has selected a file                                                                                                                
    
    $("#archiveFolder").click(function(){
     
        var timerId = setInterval(function() {
	if($('#archiveFolder').val() !== '') {
            clearInterval(timerId);
 
            $('#uploadForm').submit();
        }
    }, 500);
    })
    
 
    $('#uploadForm').submit(function() {
        status('uploading the file ...');
 
        $(this).ajaxSubmit({                                                                                                                 
 
            error: function(xhr) {
		status('Error: ' + xhr.status);
            },
 
            success: function(response) {
                $('#status').text("upload completed successfully");
                   $('#uploadForm').resetForm();
                 var template = Handlebars.compile($("#app-built-template").html());
                     $("#app-built").html(template(response));
		//TODO: We will fill this in later
            }
	});
 
	// Have to stop the form from submitting and causing                                                                                                       
	// a page refresh - don't forget this                                                                                                                      
	return false;
    });
 
    function status(message) {
	$('#status').text(message);
    }

    function downloadApp(){
        var type = $(this).data("type");
        window.open("/download?type="+type)
       

    }
});