/**
 * Created by hyochan on 2015-02-18.
 */
var express = require('express');
var router = express.Router();

// mysql을 쓰기 떄문에 아래 추가
var connection = require('../database/mysql_pool');
var response = require('../const/response_code');

// 구현 완료 : 회원가입
router
    .get('/', function(req, res){
        console.log("get get get");
        res.end();
    })
    .post('/', function(req, res){
        var cus_id = req.body.cus_id;
        var password = req.body.password;
        var email = req.body.email;
        var name = req.body.name;
        var phone = req.body.phone;
        var result = {};
        result.missingParam = "";

        if(cus_id == undefined){
            result.missingParam += "missingParam : cus_id\n";
        }
        if(password == undefined){
            result.missingParam += "missingParam : password\n";
        }
        if(email == undefined){
            result.missingParam += "missingParam : email\n";
        }
        if(name == undefined){
            result.missingParam += "missingParam : name\n";
        }
        if(phone == undefined){
            result.missingParam += "missingParam : phone\n";
        }

        // sql
        var sql = "SELECT * from customer where cus_id = ? ";
        connection.query(sql, [cus_id], function(err, rows){
            if(err){ throw err;}
            else{
                // email 중복을 알림  requestCode = 0
                if(rows.length != 0){
                    console.log("signup not processed : email is duplicated");
                    result.resultCode = response.ALREADY_INSERTED;
                    res.setHeader('Content-Type', 'application/json; charset=utf8');
                    res.json(result);
                } else{
                    // 회원가입 완료 : requestCode = 1
                    console.log("signup is processing");
                    sql = "insert into customer " +
                    "(cus_id, password, email, name, phone, date_sign, date_login, img, description) " +
                    "VALUES (?,?,?,?,?,?,?,?,?)";
                    connection.query(sql,
                        [cus_id, password, email, name, phone, new Date(), new Date(), "", ""], function(err){
                            if(err){ throw err;}
                            else{
                                result.resultCode = response.SUCCESS;
                                res.setHeader('Content-Type', 'application/json; charset=utf8');
                                res.json(result);
                            }
                    });
                }
            }
        });
    });

module.exports = router;