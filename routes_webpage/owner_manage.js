var express = require('express');
var router = express.Router();
var path = require('path');
var connection = require('../database/mysql_pool');
var fs = require('fs');

/* GET Favorite page. */
router
    .get('/', function(req, res) {
        res.render('owner_manage',
            {
                title: 'Owner Manage',
                subtitle1: ' 로그인',
                subtitle2: '상점주 관리',
                subtitle3: '고객 관리'
            });
    });

router
    .post('/add', function(req, res){
        var market =
        {
            mar_id : req.body.mar_id,
            password:req.body.password,
            name:req.body.mar_name,
            tel:req.body.tel,
            phone:req.body.phone,
            img:"",
            email:req.body.email,
            address:req.body.address,
            category:req.body.category,
            homepage:req.body.homepage,
            description:req.body.description,
            date_sign: new Date(),
            date_login: new Date()
        };


        // 이미지 업로드
        if(req.files.image){
            console.log("image path : " + req.files.image.path);
            market.img = market.mar_id +".png";
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

        // product 테이블에 상품 등록
        connection.query('INSERT INTO owner ' +
            '(mar_id, password, mar_name, tel, phone, img, email, address, category, homepage, description, date_sign, date_login)' +
            'VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [
                market.mar_id,
                market.password,
                market.name,
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
            ]);

        res.writeHeader(200, {"Content-Type": "text/html"});
        res.write(
            '<html>' +
            '<head><meta charset="utf-8"> </head>' +
                // '<script>alert("상품이 추가 되었습니다.");</script>' +
            '<body>' +
            '아이디 : ' + market.mar_id + '<br>' +
            '암호 : ' + market.password + '<br>' +
            '상점명 : ' + market.name + '<br>' +
            '전화번호 : ' + market.tel + '<br>' +
            '폰번호 : ' + market.phone + '<br>' +
            '이미지 : ' + market.img + '<br>' +
            '이메일 : ' + market.email + '<br>' +
            '주소 : ' + market.address + '<br>' +
            '카테고리 : ' + market.category + '<br>' +
            '홈페이지 : ' + market.homepage + '<br>' +
            '설명 : ' + market.description + '<br><br>' +
            '<a href="javascript:history.back()">뒤로가기</a>' +
            '</body>' +
            '</html>'
        );
        res.end();
});

module.exports = router;
