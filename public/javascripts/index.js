//자식 페이지에서 로그인 화면으로 바꾸기 수행
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
var login = false;
$(document).ready(function (){

    var httpObj = getHTTPObject();

    $.ajax({
        type : "get",
        url : "/checklogin",
        dataType : "json",
        success : function(data){
            if (data.result == false) {
                login = false;
                $('#logged_in').hide();
            }
            else{
                // var show = "";
                login = true;
                $('#login').hide();
            }
        },
        error:function(request,status,error){
            alert("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error);
        }
    });
});
