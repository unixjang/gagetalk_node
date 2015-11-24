function getHTTPObject(){
    if(window.ActiveXObject){
        return new ActiveXObject("Microsoft.XMLHTTP");
    }
    else if (window.XMLHttpRequest){
        return new XMLHttpRequest();
    }
    else{
        alert("Your browser does not support AJAX.");
        return null;
    }
}

//jQuery
$(document).ready(function (){

    var httpObj = getHTTPObject();

    $.ajax({
        type : "get",
        url : "/checklogin",
        dataType : "json",
        success : function(data){
            if (data.result == false) {
                $('#logged_in').hide();
            }
            else{
                // var show = "";
                $('#login').hide();
            }
        },
        error:function(request,status,error){
            alert("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error);
        }
    });
/*
    $('#form_login').submit(function () {
        var formData = $("#form_login").serialize();
        var action = $("#form_login").attr('action');
        $.ajax({
            type : "post",
            url : action,
            data : formData,
            cache : false,
            dataType : "json",
            success : function(data) {
                alert(data);
                if (data.result == false) {
                    login = false;
                    $('#logged_in').hide();
                }
                else {
                    // var show = "";
                    login = true;
                    $('#login').hide();
                }
            }
        });
    });
*/
});
