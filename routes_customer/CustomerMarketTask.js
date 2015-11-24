/**
 * Created by hyochan on 2015-02-18.
 */
var express = require('express');
var router = express.Router();

// mysql을 쓰기 떄문에 아래 추가
var connection = require('../database/mysql_pool');
var response = require('../const/response_code');

router
    .get('/', function(req, res){
        console.log("get get get");
        res.end();
    })
    .post('/', function(req, res){
        var category = req.body.category;
        var result = {};

        if(category == undefined){
            result.resultCode = response.NO_REQ_PARAM;
            result.missingParam = "category is missing";
            res.setHeader('Content-Type', 'application/json; charset=utf8');
            res.json(result);
        }
        else{
            console.log("category : " + category);
            if(category == "" || category == "전체"){
                var sql = "SELECT * FROM owner";
                connection.query(sql,  function(err, rows){
                    if (err){throw err;}
                    else{
                        console.log(rows.length + " markets exists for all category");
                        result.resultCode = response.SUCCESS;
                        result.market = [];
                        for(var i = 0; i<rows.length; i++){
                            console.log("i : " + i);
                            result.market.push({
                                mar_id : rows[i].mar_id,
                                mar_name : rows[i].mar_name,
                                tel : rows[i].tel,
                                phone : rows[i].phone,
                                img : rows[i].img,
                                email : rows[i].email,
                                address : rows[i].address,
                                category : rows[i].category,
                                homepage : rows[i].homepage,
                                description : rows[i].description,
                                date_sign : rows[i].date_sign,
                                date_login : rows[i].date_login
                            });
                        }
                        res.setHeader('Content-Type', 'application/json; charset=utf8');
                        res.json(result);
                    }
                });
            }else{
                sql = "SELECT * FROM owner where category = ?";
                connection.query(sql, [category], function(err, rows){
                    if (err){
                        throw err;
                    }
                    else{
                        console.log(rows.length + " markets exists for all category");
                        result.resultCode = response.SUCCESS;
                        for(var i = 0; i<rows.length; i++){
                            console.log("i : " + i);
                            result.market.push({
                                mar_id : rows[i].mar_id,
                                mar_name : rows[i].mar_name,
                                tel : rows[i].tel,
                                phone : rows[i].phone,
                                img : rows[i].img,
                                email : rows[i].email,
                                address : rows[i].address,
                                category : rows[i].category,
                                homepage : rows[i].homepage,
                                description : rows[i].description,
                                date_sign : rows[i].date_sign,
                                date_login : rows[i].date_login
                            });
                        }
                        res.setHeader('Content-Type', 'application/json; charset=utf8');
                        res.json(result);
                    }
                });
            }
        }
    });

module.exports = router;