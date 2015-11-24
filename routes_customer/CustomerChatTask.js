/**
 * Created by hyochan on 4/26/15.
 */
var express = require('express');
var router = express.Router();

// mysql을 쓰기 떄문에 아래 추가
var response = require('../const/response_code');
var connection = require('../database/mysql_pool');
var script_func = require('../global_func/script_func');

router
    .get('/select', function(req, res){
        console.log("get get get");
        res.end();
    })
    .post('/select', function(req, res){
        var result = {};
        // not logged in
        if(!req.session.customer){
            result.resultCode = response.NOT_LOGGED_IN;
            res.setHeader('Content-Type', 'application/json; charset=utf8');
            res.end(JSON.stringify(result));
        }
        // logged in
        else{
            result.resultCode = response.SUCCESS;
            var cus_id = req.session.customer.id;
            var mar_id = req.body.mar_id;
            console.log("get chat : " + mar_id + ", id : " + cus_id);
            // id 중복 검사
            var sql = "SELECT * from chat where cus_id = ? and mar_id = ?";
            connection.query(sql, [cus_id, mar_id], function(err, rows){
                if(err){ throw err;}
                else{
                    var chat = [];
                    for(var i=0; i<rows.length; i++){
                        var date = script_func.convertUTFDateToLocalDate(rows[i].send_date);
                        date = date.toISOString().substr(0, 19).replace('T', ' ');
                        chat.push({
                            num : rows[i].num,
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
                    result.chat = chat;
                    res.setHeader('Content-Type', 'application/json; charset=utf8');
                    res.json(result);
                }
            });
        }
    });

// req customer unread chat

router
    .get('/unread/:chat_num', function(req, res){
        var result ={};
        var cus_id = "aa";
        var chat_num = req.params.chat_num;
        chat_num = parseInt(chat_num);
        console.log("get chat - id : " + cus_id + ", chat_num : " + chat_num);

        if(!script_func.isNumeric(chat_num)){
            result.resultCode = response.WRONG_PARAMETER;
            res.setHeader('Content-Type', 'application/json; charset=utf8');
            res.json(result);
        }else{
            result.resultCode = response.SUCCESS;
            // id 중복 검사
            var sql = "SELECT * from chat where cus_id = ? and num >= ?";
            connection.query(sql, [cus_id, chat_num], function(err, rows){
                if(err){ throw err;}
                else{
                    var chat = [];
                    for(var i=0; i<rows.length; i++){
                        var date = script_func.convertUTFDateToLocalDate(rows[i].send_date);
                        date = date.toISOString().substr(0, 19).replace('T', ' ');
                        chat.push({
                            num : rows[i].num,
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
                    result.chat = chat;
                    res.setHeader('Content-Type', 'application/json; charset=utf8');
                    res.json(result);
                }
            });
        }
    })
    .post('/unread', function(req, res){
        var result = {};
        // not logged in
        if(!req.session.customer){
            result.resultCode = response.NOT_LOGGED_IN;
            res.setHeader('Content-Type', 'application/json; charset=utf8');
            res.end(JSON.stringify(result));
        }
        // logged in
        else{
            var cus_id = req.session.customer.id;
            var chat_num = req.body.chat_num;
            console.log("get chat - id : " + cus_id + ", chat_num : " + chat_num);
            if(!script_func.isNumeric(chat_num)){
                result.resultCode = response.WRONG_PARAMETER;
                res.setHeader('Content-Type', 'application/json; charset=utf8');
                res.json(result);
            }
            else{
                result.resultCode = response.SUCCESS;
                // id 중복 검사
                var sql = "SELECT * from chat where cus_id = ? and num > ?";
                connection.query(sql, [cus_id, chat_num], function(err, rows){
                    if(err){ throw err;}
                    else{
                        var chat = [];
                        for(var i=0; i<rows.length; i++){
                            var date = script_func.convertUTFDateToLocalDate(rows[i].send_date);
                            date = date.toISOString().substr(0, 19).replace('T', ' ');
                            chat.push({
                                num : rows[i].num,
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
                        result.chat = chat;
                        res.setHeader('Content-Type', 'application/json; charset=utf8');
                        res.json(result);
                    }
                });
            }
        }
    });

module.exports = router;