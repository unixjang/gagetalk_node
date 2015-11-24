/**
 * Created by hyochan on 5/3/15.
 */
var express = require('express');
var router = express.Router();
var response = require('../const/response_code');
var connection = require('../database/mysql_pool');

/* test chat page */
router
    .get('/', function(req, res) {

        var sql = " select mar_id, img, mar_name, tel, phone, category, address, homepage, date_sign, date_login from owner";
        connection.query(sql, function(err, rows){
            if (err) {throw err;}
            else{
                var result = [];
                for(var i in rows){
                    var tmpSignDate = new Date(rows[i].date_sign);
                    var tmpLoginDate = new Date(rows[i].date_login);
                    var signDate = tmpSignDate.getFullYear() + "-" +
                            tmpSignDate.getMonth() + "-" +
                            tmpSignDate.getDate();
                    var loginDate = tmpLoginDate.getFullYear() + "-" +
                            tmpLoginDate.getMonth() + "-" +
                            tmpLoginDate.getDate();

                    result.push({
                        mar_id : rows[i].mar_id,
                        mar_name : rows[i].mar_name,
                        img : rows[i].img,
                        tel : rows[i].tel,
                        phone : rows[i].phone,
                        category : rows[i].category,
                        address : rows[i].address,
                        homepage : rows[i].homepage,
                        date_sign : signDate,
                        date_login : loginDate
                    });
                }
                res.render('chatapp_customer', {markets : result});
            }
        });
    })
    /* checklogin */
    .get('/checklogin', function(req, res){
        var result = [];
        if(req.session.customer){
            var customer = {id : req.session.customer.id, name : req.session.customer.name, login : "customer"};
            console.log("customer logged in : " + customer.id);
            console.log("customer name is : " + customer.name);
            result.push({"resultCode": response.SUCCESS});
            result.push(customer);
            res.header('Access-Control-Allow-Credentials', 'true');
            res.status(200).send(result);
        }
        else{
            console.log("login failed");
            req.session.error = 'Authentication failed.';
            result.push({"resultCode": response.NOT_LOGGED_IN});
            res.status(200).send(result);
        }
    })
    /* login */
    .post('/login', function(req, res){
        var result = [];
        var cus_id = req.body.cus_id;
        var password = req.body.password;

        // customer login
        console.log("customer login : " + cus_id + ", password : " + password);
        var sql = "select * from customer where cus_id = ? and password =?";
        connection.query(sql, [cus_id, password], function(err, rows) {
            if (err) {throw err;}
            else {
                if(rows.length == 0){
                    result.push({resultCode : response.NO_DATA});
                    res.json(result);
                }
                else{
                    result.push({resultCode : response.SUCCESS});
                    var customer = {
                        id : rows[0].cus_id,
                        /*password : rows[0].password,*/
                        name : rows[0].name
                    };
                    result.push(customer);
                    req.session.regenerate(function(){
                        req.session.customer = customer;
                        req.session.success = 'Authenticated as ' + customer.id;
                        req.session.save(); // this saves the modificaitons
                        res.header('Access-Control-Allow-Credentials', 'true');
                        // res.json(result);
                        res.send(result);
                    });
                }
            }
        });
    })
    /* logout */
    .get('/logout', function(req, res){
    req.session.destroy(function(){
        console.log("logout");
        res.status(200).send({"resultCode":response.SUCCESS});
    });
});

module.exports = router;
