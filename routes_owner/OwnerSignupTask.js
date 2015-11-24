/**
 * Created by hyochan on 4/26/15.
 */
var express = require('express');
var fs = require('fs');
var router = express.Router();

// mysql을 쓰기 떄문에 아래 추가
var connection = require('../database/mysql_pool');
var RESPONSE = require('../const/response_code');

// 구현 완료 : 회원가입
router
    .get('/', function(req, res){
        console.log("get get get");
        res.end();
    })
    .post('/', function(req, res){

        console.log("OwnerSignupTask");
        var market =
        {
            mar_id:req.body.mar_id,
            mar_name:req.body.mar_name,
            password:req.body.password,
            email:req.body.email,
            tel:req.body.tel,
            phone:req.body.phone,
            img: req.body.mar_name + ".png",
            address:req.body.address,
            category:req.body.category,
            homepage:req.body.homepage,
            description:req.body.description,
            date_sign: new Date(),
            date_login: new Date()
        };
        console.log("id : " + market.mar_id);
        console.log("mar_name : " + market.mar_name);
        console.log("image_name : " + market.img);

        var result = {};
        // market_name && email 중복 검사
        var sql = "SELECT * from owner where mar_name = ? OR mar_id = ? ";
        connection.query(sql, [market.mar_name, market.mar_id], function(err, rows){
            if(err){ throw err;}
            else{
                console.log("check if owner is unique.. ");
                // email 중복을 알림  requestCode = 0
                if(rows.length != 0){
                    console.log("signup not processed : mar_name or email is duplicated");
                    result.resultCode = RESPONSE.NO_DATA;
                    if(rows[0].mar_name == market.mar_name){
                        result.duplicate = "market_name";
                    }
                    else if(rows[0].mar_id == market.mar_id){
                        result.duplicate = "mar_id";
                    }
                    res.setHeader('Content-Type', 'application/json; charset=utf8');
                    res.json(result);
                } else{

                    // 이미지 업로드
                    if(req.files.image){
                        console.log("image path : " + req.files.image.path);
                        console.log("img : " + market.img);
                        // market.img = market.market_name +".png";
                        // img string should not have a white space
                        market.img = market.img.replace(/ /g,'');
                        fs.readFile(req.files.image.path, function (err, data) {

                            var imageName = req.files.image.name;

                            /// If there's an error
                            if(!imageName){
                                console.log("There was an error in image file");
                                res.redirect("/");
                                res.end();
                            } else {
                                var newPath = __dirname + "/../public/images/" + market.img;
                                /// write file to uploads/fullsize folder
                                fs.writeFile(newPath, data, function (err) {
                                    /// let's see it
                                    if(err) throw err;
                                    else{
                                        // delete file
                                        fs.unlink(req.files.image.path);
                                    }
                                });
                            }
                        });
                    }

                    connection.query('INSERT INTO owner ' +
                        '(mar_id, password, mar_name, tel, phone, img, email, ' +
                        'address, category, homepage, description, date_sign, date_login)' +
                        'VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
                        [
                            market.mar_id,
                            market.password,
                            market.mar_name,
                            market.tel,
                            market.phone,
                            market.img,
                            market.email,
                            market.address,
                            market.category,
                            market.homepage,
                            market.description,
                            new Date(),
                            new Date()
                        ], function(err){
                            if(err){throw err;}
                            else{
                                result.resultCode = RESPONSE.SUCCESS;
                                res.setHeader('Content-Type', 'application/json; charset=utf8');
                                res.json(result);
                            }
                        }
                    );
                }
            }
        });
    });

module.exports = router;