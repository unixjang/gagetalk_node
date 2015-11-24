/**
 * Created by hyochan on 5/17/15.
 */
$(document).ready(function () {
    var login;
    checklogin();

    /*var socket = io.connect(document.location.href);*/
    /*var socket = io.connect("http://192.168.0.5:3000");*/
    var socket = io.connect("http://hyochan.org:3000");
    socket.on('message_peers', function(customer, chat){
        var send_date = new Date();
        send_date = send_date.getMonth() + "월 " +
            send_date.getDate() + "일 " +
            send_date.getHours() +":"+send_date.getMinutes() + ":" + send_date.getSeconds();
        var html =
            '<div style="padding: 15px;" class="media"><a href="#" class="pull-left"><img src="http://lorempixel.com/30/30/people/1/" style="width:50px;" alt="" class="media-object img-circle"/></a>' +
                '<div style="padding-left: 10px" class="media-body">' +
                    '<h4 class="media-heading">' + customer.cus_name + '<span style="font-size:small;" class="small pull-right">' + send_date +'</span></h4>' +
                    '<p>' + chat.message + '</p>' +
                '</div>' +
            '</div>' +
            '<hr/>';

        $('#chat').append(html);
        $('#chat').animate({
            scrollTop: $("#chat")[0].scrollHeight
        }, 300);
    });
    socket.on('message_my', function(owner, chat){
        var send_date = new Date();
        send_date = send_date.getMonth() + "월 " +
            send_date.getDate() + "일 " +
            send_date.getHours() +":"+send_date.getMinutes() + ":" + send_date.getSeconds();
        var html =
            '<div style="padding: 15px;" class="media"><a href="#" class="pull-left"><img src="http://lorempixel.com/30/30/people/1/" style="width:50px;" alt="" class="media-object img-circle"/></a>' +
            '<div style="padding-left: 10px" class="media-body">' +
            '<h4 class="media-heading">' + owner.mar_name + '<span style="font-size:small;" class="small pull-right">' + send_date +'</span></h4>' +
            '<p>' + chat.message + '</p>' +
            '</div>' +
            '</div>' +
            '<hr/>';

        $('#chat').append(html);
        $('#chat').animate({
            scrollTop: $("#chat")[0].scrollHeight
        }, 300);
    });
    socket.on('not_logged_in', function(){
        alert("you are not logged in");
    });

    const responseCode = {
        NOT_LOGGED_IN: -1,
        NO_DATA: 0,
        SUCCESS: 1,
        NO_REQ_PARAM: 2
    };

    // owner login btn click
    $('#owner_login').click(function (e) {
        $('#modal_login_title').text('Owner Login');
        $('#form_login')[0].reset();

        $('#owner_email').show();
    });
    // click on list-group : changing chatroom
    $('.list-group li').click(function (e) {
        e.preventDefault()
        var menu = $(this);
        menu.parent().find('li').removeClass('active');
        menu.addClass('active');
    });
    // btn signup click
    $("#btn_signup").click(function () {
        $('#modal_login').modal('hide');
        $('#modal_signup').modal('show');
    });
    // btn logout click
    $("#btn_logout").click(function () {
        $.ajax({
            type: "get",
            url: "/chatapp_owner/logout",
            dataType: "json",
            success: function (data) {
                if (data.resultCode == responseCode.SUCCESS) {
                    $('#modal_logout').modal('hide');
                    // logged in
                    $('.loggedin').hide();
                    $('.loggedout').show();
                    socket.disconnect();
                    login = undefined;
                }
            },
            error: function (request, status, error) {
                alert("code:" + request.status + "\\n" + "message:" + request.responseText + "\n" + "error:" + error);
            }
        });
    });
    $("#btn_sendmessage").click(function(){
        if($('#input_message').val() != ""){
            var chat = {
                message : $('#input_message').val(),
                type : 0,
                path : "",
                send_date : ""
            };
            socket.emit('evt_msg_customer', {cus_id :"aa", cus_name:"ㅂ"}, chat);
        }
    });

    // 로그인 폼 submit
    $("#form_login").on('submit', (function (e) {
        e.preventDefault();
        var form = document.forms['form_login'];
        // 폼검증 전처리
        if (!form.mar_id.value) {
            alert("please write the id");
            return false;
        }
        if (!form.password.value) {
            alert("please write the password");
            return false;
        }
        //폼검증 후 처리
        var formData = $("#form_login").serialize();
        var action = $("#form_login").attr('action');
        $.ajax({
            type: "post",
            url: action,
            data: formData,
            xhrFields: {withCredentials: true},
            dataType: "json",
            success: function (jsonArr) {
                if (jsonArr[0].resultCode == responseCode.NO_DATA) {
                    alert("login failed");
                }
                else {
                    // reset chat div
                    $('#chat').empty();
                    $('#modal_login').modal('hide');
                    // logged in
                    $('.loggedin').show();
                    $('.loggedout').hide();
                    checklogin();
                }
            },
            //오류 발견시 체크
            error: function (request, status, error) {
                //alert("code:"+request.status+"\\n"+"message:"+request.responseText+"\n"+"error:"+error);
            }
        });
    }));

    // 회원가입 폼 submit
    $("#form_signup").on('submit', (function (e) {
        e.preventDefault();
        var form = document.forms['form_signup'];
        // 폼검증 전처리
        if(!form.email.value) {
            alert("이메일을 입력해주세요.");
            return false;
        }
        if(!form.password.value) {
            alert("암호를 입력해주세요.");
            return false;
        }
        if(!form.password_ok.value){
            alert("암호를 확인해주세요.");
            return false;
        }
        if(form.password.value != form.password_ok.value){
            alert("암호와 암호확인이 일치하지 않습니다.");
            return false;
        }
        if(!form.market_name.value){
            alert("마켓명을 입력해주세요");
            return false;
        }
        if(!form.tel.value){
            alert("전화번호를 입력해주세요");
            return false;
        }
        if(!form.phone.value){
            alert("폰번호를 입력해주세요");
            return false;
        }
        if(!form.image.value){
            alert("이미지를 선택해주세요");
            return false;
        }
        if(!form.address.value){
            alert("주소를 입력해주세요");
            return false;
        }
        if(!form.category.value){
            alert("카테고리를 입력해주세요");
            return false;
        }
        if(!form.homepage.value){
            alert("홈페이지를 입력해주세요");
            return false;
        }
        if(!form.description.value){
            alert("설명을 입력해주세요");
            return false;
        }
        //폼검증 후 처리
        // var formData = $("#form_profile").serialize();
        var formData = new FormData(this);
        var action = $("#form_signup").attr('action');
        $.ajax({
            type: "post",
            url: action,
            data: formData,
            contentType: false,
            cache: false,
            processData: false,
            xhrFields: {withCredentials: true},
            dataType: "json",
            success: function (jsonArr) {
                if (jsonArr[0].resultCode == responseCode.NO_DATA) {
                    if(jsonArr[1].duplicate == "market_name")
                        alert("마켓명이 이미 있습니다. 다른 마켓명을 이용해주세요.");
                    else if(jsonArr[1].duplicate == "email")
                        alert("이메일이 이미 있습니다. 다른 이메일을 이용해주세요.");
                }
                else {
                    // reset chat div
                    alert("회원가입이 완료되었습니다. 로그인해주세요.");
                    $('#modal_signup').modal('hide');
                    $('#modal_login').modal('show');
                    // logged in}
                }
            },
            //오류 발견시 체크
            error: function (request, status, error) {
                //alert("code:"+request.status+"\\n"+"message:"+request.responseText+"\n"+"error:"+error);
            }
        });
    }));

    // check login
    function checklogin(){
        $.ajax({
            type: "get",
            url: "/chatapp_owner/checklogin",
            dataType: "json",
            success: function (data) {
                // alert(JSON.stringify(data));
                if (data[0].resultCode == responseCode.NOT_LOGGED_IN) {
                    // not logged in
                    $('.logggedout').show();
                    $('.loggedin').hide();
                }
                else {
                    // logged in
                    $('.loggedin').show();
                    $('.loggedout').hide();
                    // socket.socket.connect();
                    socket.emit('login', data[1]);
                    login = data[1].login;
                }
            },
            error: function (request, status, error) {
                alert("code:" + request.status + "\\n" + "message:" + request.responseText + "\n" + "error:" + error);
            }
        });
    }
});