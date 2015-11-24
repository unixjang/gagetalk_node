/**
 * Created by hyochan on 5/3/15.
 */
var express = require('express');
var router = express.Router();
var response = require('../const/response_code');
var connection = require('../database/mysql_pool');

/* test chat page */
router.get('/', function(req, res) {
    res.render('chatapp_owner');
});

/* checklogin */
router.get('/checklogin', function(req, res){
    var result = [];
    if(req.session.owner){
        var owner = {mar_id : req.session.owner.mar_id, mar_name : req.session.owner.mar_name , login : "owner"};
        console.log("owner logged in : " + owner.mar_id);
        console.log("owner maket name is : " + owner.mar_name);
        result.push({"resultCode": response.SUCCESS});
        result.push(owner);
        res.header('Access-Control-Allow-Credentials', 'true');
        res.status(200).send(result);
    }
    else{
        console.log("login failed");
        req.session.error = 'Authentication failed.';
        result.push({"resultCode": response.NOT_LOGGED_IN});
        res.status(200).send(result);
    }
});

/* login */
router.post('/login', function(req, res){
    var result = [];
    var mar_id = req.body.mar_id;
    var password = req.body.password;

    // owner login
    console.log("owner login : " + mar_id);
    var sql = "select * from owner where mar_id = ? and password =?";
    connection.query(sql, [mar_id, password], function(err, rows) {
        if (err) {throw err;}
        else {
            if(rows.length == 0){
                result.push({resultCode : response.NO_DATA});
                res.json(result);
            }
            else{
                result.push({resultCode : response.SUCCESS});
                var owner = {
                    mar_id : rows[0].mar_id,
                    /*password : rows[0].password,*/
                    mar_name : rows[0].mar_name
                };
                req.session.regenerate(function(){
                    req.session.owner = owner;
                    req.session.success = 'Authenticated as ' + owner.mar_id;
                    req.session.save();
                    res.header('Access-Control-Allow-Credentials', 'true');
                    // res.json(result);
                    res.send(result);
                });
            }
        }
    });
});

/* logout */
router.get('/logout', function(req, res){
    req.session.destroy(function(){
        console.log("logout");
        res.status(200).send({"resultCode":response.SUCCESS});
    });
});



module.exports = router;
