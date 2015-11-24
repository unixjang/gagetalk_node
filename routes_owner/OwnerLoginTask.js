/**
 * Created by hyochan on 4/26/15.
 */
var express = require('express');
var router = express.Router();

var connection = require('../database/mysql_pool');
var response = require('../const/response_code');

// 사장님 로그인
router
    .get('/', function(req, res){
        console.log("get get get");
        res.end();
    })
    .post('/', function(req, res){
        console.log("post newuser");

        var mar_id = req.body.mar_id;
        var password = req.body.password;

        var result = {};

        console.log("post login - market id : " + mar_id + ", pw : " + password);

        // id 중복 검사
        sql = "SELECT * FROM owner WHERE mar_id = ? AND password = ?";
        connection.query(sql, [mar_id, password], function(err, rows){
            if(err){ throw err;}
            else{
                // market_name & password 일치하지 않음 :  requestCode = 0
                if(rows.length == 0){
                    console.log("login failed : no matching data");
                    result.resultCode = response.NO_DATA;
                    res.setHeader('Content-Type', 'application/json; charset=utf8');
                    res.json(result);
                }
                // 로그인 성공 : requestCode = 1
                else{
                    var mar_id = rows[0].mar_id;
                    var mar_name = rows[0].mar_name;
                    if(req.session.owner){
                        console.log("ALREADY LOGGED IN : " + req.session.owner.id);
                        //res.status(200).send({"result":true});
                    }else{
                        console.log("NOT logged in ");
                        var owner = {id: mar_id, password:password};
                        req.session.regenerate(function(){
                            req.session.owner = owner;
                            req.session.success = 'Authenticated as ' + owner.id;
                            if(req.session.owner){console.log("logged in")};
                        });
                        //res.status(200).send({"result":false});
                    }
                    /*
                     var password = rows[0].password;
                     var phone = rows[0].phone;
                     var img = rows[0].img;
                     var description = rows[0].description;
                     var date_sign = rows[0].date_sign;
                     var date_login = rows[0].date_login;
                     */

                    connection.query(
                        'UPDATE owner SET date_login = ? WHERE mar_name = ?',
                        [new Date(), mar_name], function(err){
                            if(err){ throw err;}
                            else{
                                console.log("login success processing");
                                result.resultCode = response.SUCCESS;
                                result.mar_id = mar_id;
                                result.mar_name = mar_name;
                                res.setHeader('Content-Type', 'application/json; charset=utf8');
                                res.json(result);
                            }
                        });
                }
            }
        });
    });


/* force */
router
    .post('/forcelogin', function(req, res){
        var result = {};
        if(req.session.owner){
            var owner = {id : req.session.owner.id};
            console.log("customer logged in : " + owner.id);
            result.resultCode = response.SUCCESS;
            res.json(result);
        }
        else{
            console.log("NOT logged in try relogin");
            var owner = {id: req.body.mar_id, password: req.body.password};
            req.session.regenerate(function(){
                req.session.owner = owner;
                req.session.success = 'Authenticated as ' + owner.id;
                if(req.session.owner){
                    console.log("logged in");
                    result.resultCode = response.SUCCESS;
                    res.json(result);

                }
                else{
                    req.session.error = 'Authentication failed.';
                    result.resultCode = response.NOT_LOGGED_IN;
                    res.json(result);
                }
            });
        }
    });


module.exports = router;