/**
 * Created by hyochan on 5/17/15.
 */
$(document).ready(function () {
    var login;
    var room;
    var mar_name;
    checklogin();

    /*var socket = io.connect(document.location.href);*/
    /*var socket = io.connect("http://192.168.0.5:3000");*/
    var socket = io.connect("http://hyochan.org:3000");
    socket.on('message_peers', function(owner, chat){
        var send_date = new Date();
        send_date = send_date.getMonth() + "월 " +
            send_date.getDate() + "일 " +
            send_date.getHours() +":"+send_date.getMinutes() + ":" + send_date.getSeconds();

        // 메시지 보낸 마켓이 선택된 마켓이면 메시지 내용을 바로 append 한다
        if(room == owner.mar_id) {
            // msg I sent : img, sender, send_date, message
            var html = getPeerChatHtml("http://lorempixel.com/30/30/people/1/", owner.mar_name, send_date, chat.message);
            $('#chat').append(html);
            $('#chat').animate({
                scrollTop: $("#chat")[0].scrollHeight
            }, 300);
        }
        // 메시지를 보낸 마켓이 선택된 마켓이 아니면 메시지 카운트 1을 ul_room에서 찾아서 증가시킨다.
        else{
            $('#ul_room li').each(function(){
                if($(this).attr('data-name') == owner.mar_id){
                    $(this).find('span').show();
                    var cnt = parseInt($(this).find('span').text());
                    $(this).find('span').text(cnt+1);
                }
            });
        }
    });
    socket.on('message_my', function(clients, chat){
        var send_date = new Date();
        send_date = send_date.getMonth() + "월 " +
            send_date.getDate() + "일 " +
            send_date.getHours() +":"+send_date.getMinutes() + ":" + send_date.getSeconds();
        var html = getMyChatHtml("http://lorempixel.com/30/30/people/1/", clients.cus_id, send_date, chat.message);
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

    // customer login btn click
    $('#customer_login').click(function (e) {
        $('#modal_login_title').text('Customer Login');
        $('#form_login')[0].reset();
        // alert(data[1].email);
        // alert(data[1].name);
        $('#cus_id').show();
    });
    // addmarket btn click
    $('#add_market').click(function (e){
        $('#modal_add_market').modal('show');
    });

    // click on list-group : changing chatroom
/*    $('.list-group li').click(function (e) {
        e.preventDefault();
        var menu = $(this);
        menu.parent().find('li').removeClass('active');
        menu.addClass('active');
    });*/
    $('.list-group').delegate('li', 'click', function (e) {
        e.preventDefault();
        // alert($(this).attr('data-name'));
        // set chatroom title and value
        var menu = $(this);
        $(this).find('span').hide();
        menu.parent().find('li').removeClass('active');
        menu.addClass('active');
        mar_name = $(this).attr('data-uid');
        setChatRoom($(this).attr('data-name'));
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
            url: "/chatapp_customer/logout",
            dataType: "json",
            success: function (data) {
                if (data.resultCode == responseCode.SUCCESS) {
                    $('#modal_logout').modal('hide');
                    // logged in
                    $('.loggedin').hide();
                    $('.loggedout').show();
                    // socket.emit('disconnect');
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

        var chat = {
            message : $('#input_message').val(),
            type : 0,
            path : "",
            send_date : ""
        };
        if((chat != undefined || chat != "") && room != undefined){
            socket.emit('evt_msg_owner', {mar_id: room}, chat);
        }
    });

    // 로그인 폼 submit
    $("#form_login").on('submit', (function (e) {
        e.preventDefault();
        var form = document.forms['form_login'];
        // 폼검증 전처리
        if (!form.cus_id.value && !form.owner_email.value) {
            alert("please write the id");
            return false;
        }
        if (!form.password.value) {
            alert("please write the password");
            return false;
        }
        //폼검증 후 처리
        var formData = $("#form_login").serialize();
        console.log("formData : " + formData);
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
                    // alert("login success");
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
        if (!form.email.value) {
            alert("이메일을 입력해주세요.");
            return false;
        }
        if (!form.password.value) {
            alert("암호를 입력해주세요.");
            return false;
        }
        if (form.password.value != form.password_ok.value){
            alert("암호와 암호확인이 일치하지 않습니다.");
            return false;
        }
        if (!form.name.value){
            alert("이름을 입력해주세요");
            return false;
        }
        if (!form.phone.value){
            alert("전화번호를 입력해주세요");
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
                    alert("이미 가입된 이메일 주소입니다. 다른 이메일 주소로 시도해주세요.");
                }
                else {
                    // reset chat div
                    // alert("login success");
                    $('#modal_signup').modal('hide');
                    $('#modal_login').modal('show');
                    alert("회원가입이 완료되었습니다. 로그인해주세요.")
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
            url: "/chatapp_customer/checklogin",
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

                    // load chat room
                    getChatRoom();
                }
            },
            error: function (req, status, err) {
                alert("code:" + req.status + "\\n" + "message:" + req.responseText + "\n" + "error:" + err);
            }
        });
    }
    $('.btn_add').click(function (e){
        // alert("btn add : " + $(this).data('mar_name'));
        $.ajax({
            type: "post",
            url: "/CustomerRoomTask/insert",
            data: {mar_id : $(this).data('mar_id')},
            dataType: "json",
            success: function(data){
                if(data[0].resultCode == 1) {
                    alert("마켓을 채팅 리스트에 추가했습니다!");
                    getChatRoom();
                }
                else if(data[0].resultCode == -2)
                    alert("마켓이 이미 추가되었습니다!");
            },
            error : function (req, status, err){
                alert("code:" + req.status + "\\n" + "message:" + req.responseText + "\n" + "error:" + err);
            }
        });

    });

    function setChatRoom(title){
        // set title ui : title
        $('#room_title').text(mar_name);
        // set room value
        room = title;
        // empty
        getChat(room);
    }

    function getChat(room){
        $('#chat').empty();
        $.ajax({
            type: "post",
            url: "/CustomerChatTask/select",
            dataType: "json",
            data : {mar_id : room},
            success: function (data){
                if(data.resultCode == 1){
                    var html ="";
                    for(var i in data.chat){
                        var send_date = new Date(data.chat[i].send_date);
                        send_date = send_date.getMonth() + "월 " +
                            send_date.getDate() + "일 " +
                            send_date.getHours() +":"+send_date.getMinutes() + ":" + send_date.getSeconds();

                        if(data.chat[i].cus_id == data.chat[i].sender){
                            // msg I sent : img, sender, send_date, message
                            html += getMyChatHtml("http://lorempixel.com/30/30/people/1/", data.chat[i].sender, send_date, data.chat[i].message);
                        }
                        else{
                            // msg peers sent
                            html += getPeerChatHtml("http://lorempixel.com/30/30/people/1/", data.chat[i].sender, send_date, data.chat[i].message);
                        }
                    }

                    $('#chat').append(html);
                    $('#chat').animate({
                        scrollTop: $("#chat")[0].scrollHeight
                    }, 300);
                }else if(data.resultCode == -1){
                    alert("로그인이 되지 않았습니다. 다시 시도해주세요");
                }
            },
            error : function (req, status, err){
                alert("code:" + req.status + "\\n" + "message:" + req.responseText + "\n" + "error:" + err);
            }
        });
    }

    function getChatRoom(){
        // set chat room on the left side div (div_chat)
        $.ajax({
            type: "post",
            url: "/CustomerRoomTask/select",
            dataType: "json",
            success: function (data){
                if(data.resultCode == 1){
                    $('#ul_room').empty();
                    if(data.chatroom.length == 0){
                        $('#div_chat').hide();
                    }
                    else {
                        $('#div_chat').show();
                        // set chatroom title and value
                        if(room == undefined){
                            // set room name
                            mar_name = data.chatroom[0].mar_name;
                            setChatRoom(data.chatroom[0].mar_id);
                            for (var i in data.chatroom) {
                                var html;
                                if (i == 0) {
                                    html = '<li href="#" class="active list-group-item" ' +
                                            'data-uid="' + data.chatroom[i].mar_name + '"' +
                                            'data-name="' + data.chatroom[i].mar_id + '">'
                                            + data.chatroom[i].mar_name.substring(0,8)
                                            + '<span class="badge">0</span></li>';
                                } else {
                                    html = '<li href="#" class="list-group-item" ' +
                                            'data-uid="' + data.chatroom[i].mar_name + '"' +
                                            'data-name="' + data.chatroom[i].mar_id + '">'
                                            + data.chatroom[i].mar_name.substring(0,8)
                                            + '<span class="badge">0</span></li>';
                                }
                                $('#ul_room').append(html);
                            }
                        }else{
                            for (var i in data.chatroom) {
                                var html;
                                if (data.chatroom[i].mar_id == room) {
                                    html = '<li href="#" class="active list-group-item" ' +
                                            'data-uid="' + data.chatroom[i].mar_name + '"' +
                                            'data-name="' + data.chatroom[i].mar_id + '">'
                                            + data.chatroom[i].mar_name.substring(0,8)
                                            + '<span class="badge">0</span></li>';
                                } else {
                                    html = '<li href="#" class="list-group-item" ' +
                                            'data-uid="' + data.chatroom[i].mar_name + '"' +
                                            'data-name="' + data.chatroom[i].mar_id + '">'
                                            + data.chatroom[i].mar_name.substring(0,8)
                                            + '<span class="badge">0</span></li>';
                                }
                                $('#ul_room').append(html);
                            }
                        }
                        hideAllRoomCntIfZero();
                    }
                }else if(data.resultCode == -1){
                    alert("로그인이 되지 않았습니다. 다시 시도해주세요");
                }
            },
            error : function (req, status, err){
                alert("code:" + req.status + "\\n" + "message:" + req.responseText + "\n" + "error:" + err);
            }
        });
    }

    // 내가 보낸 메시지 html
    function getMyChatHtml(img, sender, send_date, message){
        var html =
            '<div style="padding: 15px;" class="media">' +
            '<a href="#" class="pull-left">' +
            '<img src="'+ img + '" style="width:50px;" alt="" class="media-object img-circle"/>' +
            '</a>' +
            '<div style="padding-left: 10px" class="media-body">' +
            '<h4 class="media-heading" style="#0000ed">' + sender +
            '<span style="font-size:small;" class="small pull-right">' + send_date +'</span></h4>' +
            '<p>' + message + '</p>' +
            '</div>' +
            '</div>' +
            '<hr/>';
        return html;
    }

    // 상대가 보낸 메시지 html
    function getPeerChatHtml(img, sender, send_date, message){
        var html =
            '<div style="padding: 15px;" class="media"><a href="#" class="pull-left">' +
            '<a href="#" class="pull-left">' +
            '<img src="'+ img + '" style="width:50px;" alt="" class="media-object img-circle"/>' +
            '</a>' +
            '<div style="padding-left: 10px" class="media-body">' +
            '<h4 class="media-heading">' + sender +
            '<span style="font-size:small;" class="small pull-right">' + send_date +'</span></h4>' +
            '<p>' + message + '</p>' +
            '</div>' +
            '</div>' +
            '<hr/>';
        return html;
    }

    function hideAllRoomCntIfZero(){
        $('#ul_room li').each(function(){
            var cnt = parseInt($(this).find('span').text());
            if(cnt == 0){
                $(this).find('span').hide();
            }
        });
    }
});