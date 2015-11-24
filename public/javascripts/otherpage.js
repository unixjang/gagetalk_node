/**
 * Created by unix.jang on 2015-03-19.
 */
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
                $("#content").empty();
                $(location).attr('href','/');
            }
        },
        error:function(request,status,error){
            alert("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error);
        }
    });

    //Jquery-UI DatePicker
    $( "#datetimepicker" ).datepicker({
        dateFormat: 'yy-mm-dd',
        prevText: '이전 달',
        nextText: '다음 달',
        monthNames: ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월'],
        monthNamesShort: ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월'],
        dayNames: ['일','월','화','수','목','금','토'],
        dayNamesShort: ['일','월','화','수','목','금','토'],
        dayNamesMin: ['일','월','화','수','목','금','토'],
        showMonthAfterYear: true,
        yearSuffix: '년',
        showOn: "both",
        yearRange: '1920:2014',
        changeYear: true
    });

});
