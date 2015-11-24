/**
 * Created by hyochan on 3/19/15.
 */
var express = require('express');
var router = express.Router();

const id = "admin";
const password = "password";

// 구현 중 : 관리자 로그인
router
    .get('/', function(req, res){
        if(req.session.user){
            console.log("logged in : " + req.session.user.name);
            res.status(200).send({"result":true});
        }else{
            res.status(200).send({"result":false});
        }
    })
    .post('/', function(req, res){
        var user = {name:req.body.id, password:req.body.password};
        console.log("id : " + user.name + ", password : " + password);
        if(user.name == id && user.password == password){
            req.session.regenerate(function(){
                req.session.user = user;
                req.session.success = 'Authenticated as ' + user.name;
                res.redirect('/');
            });
        } else{
            req.session.regenerate(function(){
                console.log("login failed");
                req.session.error = 'Authentication failed.';
                res.redirect('/');
            });
        }
    });

router
    .get('/logout', function(req, res){
        req.session.destroy(function(){
            console.log("logout");
            res.redirect('/');
        });
    });


module.exports = router;
