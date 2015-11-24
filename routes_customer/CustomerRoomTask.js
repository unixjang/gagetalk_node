/**
 * Created by hyochan on 4/26/15.
 */
var express = require('express');
var router = express.Router();

// mysql을 쓰기 떄문에 아래 추가
var RESPONSE = require('../const/response_code');
var connection = require('../database/mysql_pool');
var script_func = require('../global_func/script_func');

router
    .get('/insert', function(request, response){
        console.log("get get get");
        response.end();
    })
    .post('/insert', function(req, res){
        var result = {};
        // not logged in
        if(!req.session.customer){
            result.resultCode = RESPONSE.NOT_LOGGED_IN;
            res.setHeader('Content-Type', 'application/json; charset=utf8');
            res.json(result);
        }
        // logged in
        else{
            var cus_id = req.session.customer.id;
            var cus_name = req.session.customer.name;
            var mar_id = req.body.mar_id;
            var mar_name = req.body.mar_name;

            if(mar_id == undefined || mar_name == undefined){
                result.resultCode = RESPONSE.NO_REQ_PARAM;
                if(mar_id == undefined){
                    result.missingParam = "mar_id is missing";
                }
                if(mar_name == undefined){
                    result.missingParam = "mar_name is missing";
                }
                res.setHeader('Content-Type', 'application/json; charset=utf8');
                res.json(result);
            }
            else{
                // id 중복 검사
                var sql = "SELECT mar_name from chatroom where mar_id = ? and cus_id =?";
                connection.query(sql, [mar_id, cus_id], function(err, rows){
                    if(err){ throw err;}
                    else{
                        // chatroom doesn't exist so lets insert
                        if(rows.length == 0){
                            console.log("inserting chatroom ....");
                            sql = "INSERT INTO chatroom VALUES(?,?, ?,?,?,?,?,?,?, ?)";
                            connection.query(sql, [mar_id, mar_name, cus_id, cus_name, "", 2, "", new Date(), 0, cus_id], function (err) {
                                if(err){throw err;}
                                else{
                                    result.resultCode = RESPONSE.SUCCESS;
                                    res.setHeader('Content-Type', 'application/json; charset=utf8');
                                    res.json(result);
                                }
                            });
                        } else{
                            // chatroom already created
                            console.log("chatroom already exists!!!");
                            result.resultCode = RESPONSE.ALREADY_INSERTED;
                            res.setHeader('Content-Type', 'application/json; charset=utf8');
                            res.json(result);
                        }
                    }
                });
            }
        }
    });

router
    .get('/select', function(req, res){
        console.log("get get get");
        res.end();
    })
    .post('/select', function(req, res){
        var result = {};
        // not logged in
        if(!req.session.customer){
            result.resultCode = RESPONSE.NOT_LOGGED_IN;
            res.setHeader('Content-Type', 'application/json; charset=utf8');
            res.end(JSON.stringify(result));
        }
        // logged in
        else{
            var cus_id = req.session.customer.id;

            // id 중복 검사
            var sql = "SELECT * from chatroom where cus_id = ? ";
            connection.query(sql, [cus_id], function(err, rows){
                if(err){ throw err;}
                else{
                    if(rows.length == 0){
                        result.resultCode = RESPONSE.NO_DATA;
                    }
                    else{
                        var chatroom = [];
                        result.resultCode = RESPONSE.SUCCESS;
                        for(var i=0; i<rows.length; i++){
                            var date = script_func.convertUTFDateToLocalDate(rows[i].send_date);
                            date = date.toISOString().substr(0, 19).replace('T', ' ');
                            chatroom.push({
                                mar_id : rows[i].mar_id,
                                mar_name : rows[i].mar_name,
                                cus_id : rows[i].cus_id,
                                cus_name : rows[i].cus_name,
                                message : rows[i].message,
                                type : rows[i].type,
                                path : rows[i].path,
                                send_date : date,
                                read_msg : rows[i].read_msg,
                                sender : rows[i].sender
                            });
                        }
                        result.chatroom = chatroom;
                    }
                    res.setHeader('Content-Type', 'application/json; charset=utf8');
                    res.json(result);
                }
            });
        }
    });

module.exports = router;