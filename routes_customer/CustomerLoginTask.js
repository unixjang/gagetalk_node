/**
 * Created by hyochan on 2015-02-18.
 */
var express = require('express');
var router = express.Router();

// mysql을 쓰기 떄문에 아래 추가
var connection = require('../database/mysql_pool');
var response = require('../const/response_code');

router.get('/logout', function(req, res){
    req.session.destroy(function(){
        var result = {};
        console.log("logout");
        /*res.status(200).send({"result":true});*/
        result.resultCode = response.SUCCESS;
        res.setHeader('Content-Type', 'application/json; charset=utf8');
        res.json(result);
    });
});

router
    .get('/', function(req, res){
        console.log("get get get");
        res.end();
    })
    .post('/', function(req, res){
        var cus_id = req.body.cus_id;
        var password = req.body.password;
        var result = {};

        if(cus_id == undefined || password == undefined){
            console.log("customer login : missing req params");
            result.resultCode = response.NO_REQ_PARAM;
            result.missingParam = "";
            if(cus_id == undefined){
                result.missingParam += "req cus_id is missing\n";
            }
            else if(password == undefined){
                result.missingParam += "req password is missing\n";
            }
            res.setHeader('Content-Type', 'application/json; charset=utf8');
            res.json(result);
        }
        else{
            console.log("post login - cus_id : " + cus_id + ", pw : " + password);

            // id password 검사
            var sql = "SELECT * from customer where cus_id = ? and password = ?";
            connection.query(sql, [cus_id, password], function(err, rows){
                if(err){ throw err;}
                else{
                    // email & password 일치하지 않음 :  requestCode = 0
                    if(rows.length == 0){
                        console.log("login not processed : cus_id && password is wrong");
                        result.resultCode = response.NOT_LOGGED_IN;
                        res.setHeader('Content-Type', 'application/json; charset=utf8');
                        res.json(result);
                    }
                    // 로그인 성공 : requestCode = 1
                    else{
                        var cus_id = rows[0].cus_id;
                        var name = rows[0].name;
                        /*
                         var password = rows[0].password;
                         var phone = rows[0].phone;
                         var img = rows[0].img;
                         var description = rows[0].description;
                         var date_sign = rows[0].date_sign;
                         var date_login = rows[0].date_login;
                         */
                        if(req.session.customer){
                            console.log("ALREADY LOGGED IN : " + req.session.customer.id);
                            //res.status(200).send({"result":true});
                        }else{
                            console.log("NOT logged in ");
                            var customer = {
                                id: cus_id,
                                name: name,
                                password:password
                            };
                            req.session.regenerate(function(){
                                req.session.customer = customer;
                                req.session.success = 'Authenticated as ' + customer.id;
                                if(req.session.customer){console.log("logged in")};
                            });
                            //res.status(200).send({"result":false});
                        }

                        connection.query(
                            'UPDATE customer SET date_login = ? where cus_id = ?',
                            [new Date(), cus_id], function(err){
                                if(err){ throw err;}
                                else{
                                    console.log("login success processing");
                                    result.resultCode = response.SUCCESS;
                                    result.cus_id = cus_id;
                                    result.name = name;
                                    res.setHeader('Content-Type', 'application/json; charset=utf8');
                                    res.json(result);
                                }
                            });
                    }
                }
            });
        }
    });

/* check */
router
    .post('/checklogin', function(req, res){
        var result = {};
        if(req.session.customer){
            console.log("customer is logged in");
            result.resultCode = response.SUCCESS;
        }else{
            result.resultCode = response.NOT_LOGGED_IN;
            console.log("customer is not logged in");
        }
    });

/* force */
router
    .post('/forcelogin', function(req, res){
        var result = {};

        if(req.session.customer){
            var customer = {id : req.session.customer.id};
            console.log("customer logged in : " + customer.id);
            result.resultCode = response.SUCCESS;
            res.json(result);
        }
        else{
            var cus_id = req.body.cus_id;
            var password = req.body.password;

            if(cus_id == undefined || password == undefined){
                console.log("customer login : missing req params");
                result.resultCode = response.NO_REQ_PARAM;
                result.missingParam = "";
                if(cus_id == undefined){
                    result.missingParam += "req cus_id is missing\n";
                }
                else if(password == undefined){
                    result.missingParam += "req password is missing\n";
                }
                res.setHeader('Content-Type', 'application/json; charset=utf8');
                res.json(result);
            }
            else{
                console.log("post login - cus_id : " + cus_id + ", pw : " + password);

                // id password 검사
                var sql = "SELECT * from customer where cus_id = ? and password = ?";
                connection.query(sql, [cus_id, password], function(err, rows){
                    if(err){ throw err;}
                    else{
                        // email & password 일치하지 않음 :  requestCode = 0
                        if(rows.length == 0){
                            console.log("login not processed : cus_id && password is wrong");
                            result.resultCode = response.NOT_LOGGED_IN;
                            res.setHeader('Content-Type', 'application/json; charset=utf8');
                            res.json(result);
                        }
                        // 로그인 성공 : requestCode = 1
                        else{
                            var cus_id = rows[0].cus_id;
                            var name = rows[0].name;
                            /*
                             var password = rows[0].password;
                             var phone = rows[0].phone;
                             var img = rows[0].img;
                             var description = rows[0].description;
                             var date_sign = rows[0].date_sign;
                             var date_login = rows[0].date_login;
                             */
                            if(req.session.customer){
                                console.log("ALREADY LOGGED IN : " + req.session.customer.id);
                                connection.query(
                                    'UPDATE customer SET date_login = ? where cus_id = ?',
                                    [new Date(), cus_id], function(err){
                                        if(err){ throw err;}
                                        else{
                                            console.log("login success processing");
                                            result.resultCode = response.SUCCESS;
                                            result.cus_id = cus_id;
                                            result.name = name;
                                            res.setHeader('Content-Type', 'application/json; charset=utf8');
                                            res.json(result);
                                        }
                                    });
                                //res.status(200).send({"result":true});
                            }else{
                                console.log("NOT logged in ");
                                var customer = {
                                    id: cus_id,
                                    name: name,
                                    password:password
                                };
                                req.session.regenerate(function(){
                                    req.session.customer = customer;
                                    req.session.success = 'Authenticated as ' + customer.id;
                                    if(req.session.customer){console.log("logged in")};
                                    connection.query(
                                        'UPDATE customer SET date_login = ? where cus_id = ?',
                                        [new Date(), cus_id], function(err){
                                            if(err){ throw err;}
                                            else{
                                                console.log("login success processing");
                                                result.resultCode = response.SUCCESS;
                                                result.cus_id = cus_id;
                                                result.name = name;
                                                res.setHeader('Content-Type', 'application/json; charset=utf8');
                                                res.json(result);
                                            }
                                        });
                                });
                                //res.status(200).send({"result":false});
                            }
                        }
                    }
                });
            }
        }
/*
        else{
            console.log("NOT logged in try relogin");
            var customer = {
                id: req.body.cus_id,
                password: req.body.password
            };
            req.session.regenerate(function(){
                req.session.customer = customer;
                req.session.success = 'Authenticated as ' + customer.id;
                if(req.session.customer){
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
        }*/
    });

module.exports = router;