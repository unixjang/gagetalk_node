/**
 * Created by hyochan on 4/5/15.
 */
var express = require('express');
var fs = require('fs');
var path = require('path');
var router = express.Router();

// mysql을 쓰기 떄문에 아래 추가
var connection = require('../database/mysql_pool');
var response = require('../const/response_code');

router
    .get('/select', function(req, res){
        console.log("get get get");
        res.end();
    })
    .post('/select', function(req, res){
        var result = {};
        // not logged in
        if(!req.session.customer){
            console.log("NOT LOGGED IN");
            result.resultCode = response.NOT_LOGGED_IN;
            res.setHeader('Content-Type', 'application/json; charset=utf8');
            res.json(result);
        }
        // logged in
        else{
            console.log("logged in : " + req.session.customer.id);
            var sql = "SELECT * FROM customer where cus_id = ?";
            connection.query(sql, [req.session.customer.id], function (err, rows) {
                if (err) {
                    throw err;
                }
                else {
                    if (rows.length != 0) {
                        result.resultCode = response.SUCCESS;
                        result.customer = {
                            cus_id: rows[0].cus_id,
                            password: rows[0].password,
                            email: rows[0].email,
                            name: rows[0].name,
                            phone: rows[0].phone,
                            img: rows[0].img,
                            description: rows[0].description,
                            date_sign: rows[0].date_sign,
                            date_login: rows[0].date_login
                        };
                        res.setHeader('Content-Type', 'application/json; charset=utf8');
                        res.end(JSON.stringify(result));
                    }
                    else {
                        result.resultCode = response.NO_DATA;
                        res.setHeader('Content-Type', 'application/json; charset=utf8');
                        res.end(JSON.stringify(result));
                    }
                }
            });
        }
    });

router
    .get('/update', function(req, res){
        console.log("get get get");
        res.end();
    })
    .post('/update', function(req, res){

        var result = {};
        // not logged in
        if(!req.session.customer){
            result.resultCode = response.NOT_LOGGED_IN;
            res.setHeader('Content-Type', 'application/json; charset=utf8');
            res.json(result);
        }
        else if(req.body.request_param == undefined || req.body.request_value == undefined){
            result.resultCode = response.NO_REQ_PARAM;
            result.missingParam = "";
            if(req.body.request_param == undefined){
                result.missingParam += "missing param : request_param\n";
            }
            if(req.body.request_value == undefined){
                result.missingParam += "missing param : request_value";
            }
            res.setHeader('Content-Type', 'application/json; charset=utf8');
            res.json(result);
        }
        // logged in
        else{
            var reqParam = -1;
            reqParam = parseInt(req.body.request_param);
            var reqValue = req.body.request_value;
            console.log("CustomerAccountTask/update : param : " + reqParam + ", value : " + reqValue);

            const UPDATE_NAME = 0;
            const UPDATE_PASSWORD = 1;
            const UPDATE_PHONE = 2;
            const UPDATE_IMG = 3;
            const UPDATE_DESCRIPTION = 4;
            const UPDATE_EMAIL = 5;

            var sql = "";

            /*
             0 : name
             1 : password
             2 : phone
             3 : img
             4 : description
             5 : email
             */
            if (reqParam != UPDATE_IMG) {
                switch (reqParam) {
                    case UPDATE_NAME:
                        sql = "UPDATE customer set name = ? where cus_id = ?";
                        break;
                    case UPDATE_PASSWORD:
                        sql = "UPDATE customer set password = ? where cus_id = ?";
                        break;
                    case UPDATE_PHONE:
                        sql = "UPDATE customer set phone = ? where cus_id = ?";
                        break;
                    case UPDATE_DESCRIPTION:
                        sql = "UPDATE customer set description = ? where cus_id = ?";
                        break;
                    case UPDATE_EMAIL:
                        sql = "UPDATE customer set email = ? where cus_id = ?";
                }
                connection.query(sql, [reqValue, req.session.customer.id], function (err, rows) {
                    if (err) {
                        throw err
                    }
                    else {
                        if (reqParam != UPDATE_IMG) {
                            switch (reqParam) {
                                case UPDATE_NAME:
                                    sql = "SELECT name FROM customer where cus_id = ?";
                                    break;
                                case UPDATE_PASSWORD:
                                    sql = "SELECT password FROM customer where cus_id = ?";
                                    break;
                                case UPDATE_PHONE:
                                    sql = "SELECT phone FROM customer where cus_id = ?";
                                    break;
                                case UPDATE_DESCRIPTION:
                                    sql = "SELECT description FROM customer where cus_id = ?";
                                    break;
                                case UPDATE_EMAIL:
                                    sql = "SELECT email FROM customer where cus_id = ?";
                                    break;
                            }
                            connection.query(sql, [req.session.customer.id], function (err, rows) {
                                result.resultCode = response.SUCCESS;
                                result.res_data = rows[0];
                                console.log("res_data : " + JSON.stringify(result.res_data));
                                res.setHeader('Content-Type', 'application/json; charset=utf8');
                                res.json(result);
                            });
                        }
                    }
                });
            }
            else {
                // update image
                // 이미지 업로드
                if (req.files.image) {
                    console.log("image path : " + req.files.image.path);
                    var newImgName = reqValue.replace(/ /g, '');
                    // img string should not have a white space
                    fs.readFile(req.files.image.path, function (err, data) {
                        console.log("reading img file...");
                        var imgName = req.files.image.name;
                        /// If there's an error
                        if (!imgName) {
                            console.log("There was an error in image file");
                        } else {
                            var newPath = __dirname + "/../public/images/customer/" + newImgName;
                            console.log(newPath);
                            /// write file to uploads/fullsize folder
                            fs.writeFile(newPath, data, function (err) {
                                console.log("writing img file...");
                                /// let's see it
                                if (err) throw err;
                                else {
                                    // delete file
                                    fs.unlink(req.files.image.path);
                                    result.resultCode = response.SUCCESS;
                                    res.setHeader('Content-Type', 'application/json; charset=utf8');
                                    res.json(result);
                                }
                            });
                        }
                    });
                }
            }
        }
    });


module.exports = router;