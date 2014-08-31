$(document).ready(function() {
 
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
});