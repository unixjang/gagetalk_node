/**
 * Created by hyochan on 15. 5. 30.
 */
var excelbuilder = require('msexcel-builder');
var connection = require('./database/mysql_pool');
connection.connect();

// Create a new workbook file in current working-path
var workbook = excelbuilder.createWorkbook('./', 'gagetalk_database.xlsx')
var sqlCustomer = "select * from customer";
var sqlOwner = "select * from owner";
var sqlChatroom = "select * from chatroom";
var sqlChat = "select * from chat";
var sqlRates = "select * from rates";

var result = {};
var arrSql = [sqlCustomer, sqlOwner, sqlChatroom, sqlChat, sqlRates];

function addSheets(sql, cnt, callback){
    // create customer sheet
    if(sql == sqlCustomer){
        connection.query(sql, function(err, rows){
            if(err){throw err;}
            else{
                var sheet = workbook.createSheet('customer', 8, rows.length+1);
                sheet.set(1,1, "customer_email");
                sheet.set(2,1,"password");
                sheet.set(3,1,"name");
                sheet.set(4,1,"phone");
                sheet.set(5,1,"img");
                sheet.set(6,1,"description");
                sheet.set(7,1,"date_sign");
                sheet.set(8,1,"date_login");

                for(var i=0; i<rows.length;i++){
                    sheet.set(1, i+2, rows[i].customer_email);
                    sheet.set(2, i+2, rows[i].password);
                    sheet.set(3, i+2, rows[i].name);
                    sheet.set(4, i+2, rows[i].phone);
                    sheet.set(5, i+2, rows[i].img);
                    sheet.set(6, i+2, rows[i].description);
                    sheet.set(7, i+2, rows[i].date_sign);
                    sheet.set(8, i+2, rows[i].date_login);
                }
            }
        });
    } else if(sql == sqlOwner){
        connection.query(sql, function(err, rows){
            if(err){throw err;}
            else{
                var sheet = workbook.createSheet('owner', 12, rows.length+1);
                // set up title fileds
                sheet.set(1,1, "market_name");
                sheet.set(2,1, "password");
                sheet.set(3,1, "tel");
                sheet.set(4,1, "phone");
                sheet.set(5,1, "img");
                sheet.set(6,1, "email");
                sheet.set(7,1,"address");
                sheet.set(8,1,"category");
                sheet.set(9,1,"homepage");
                sheet.set(10,1,"description");
                sheet.set(11,1,"date_sign");
                sheet.set(12,1,"date_login");

                for(var i=0; i<rows.length; i++){
                    sheet.set(1, i+2, rows[i].market_name);
                    sheet.set(2, i+2, rows[i].password);
                    sheet.set(3, i+2, rows[i].tel);
                    sheet.set(4, i+2, rows[i].phone);
                    sheet.set(5, i+2, rows[i].img);
                    sheet.set(6, i+2, rows[i].email);
                    sheet.set(7,i+2, rows[i].address);
                    sheet.set(8,i+2, rows[i].category);
                    sheet.set(9,i+2,rows[i].homepage);
                    sheet.set(10,i+2,rows[i].description);
                    sheet.set(11,i+2,rows[i].date_sign);
                    sheet.set(12,i+2,rows[i].date_login);
                }

                callback(cnt);
/*
                // Save it
                workbook.save(function(ok){
                    if (!ok){
                        console.log("owner sheet not created");
                        workbook.cancel();
                    }
                    else{
                        console.log('congratulations, owner sheet created');
                        callback(cnt);
                    }
                });
*/
            }
        });
    } else if(sql == sqlChatroom){
        connection.query(sql, function(err, rows){
            if(err){throw err;}
            else{
                var sheet = workbook.createSheet('chatroom', 8, rows.length+1);
                sheet.set(1,1, "market_name");
                sheet.set(2,1,"customer_email");
                sheet.set(3,1,"message");
                sheet.set(4,1,"type");
                sheet.set(5,1,"path");
                sheet.set(6,1,"send_date");
                sheet.set(7,1,"read_msg");
                sheet.set(8,1,"sender");

                for(var i=0; i<rows.length;i++){
                    sheet.set(1, i+2, rows[i].market_name);
                    sheet.set(2, i+2, rows[i].customer_email);
                    sheet.set(3, i+2, rows[i].message);
                    sheet.set(4, i+2, rows[i].type);
                    sheet.set(5, i+2, rows[i].path);
                    sheet.set(6, i+2, rows[i].send_date);
                    sheet.set(7, i+2, rows[i].read_msg);
                    sheet.set(8, i+2, rows[i].sender);
                }

                callback(cnt);

/*                // Save it
                workbook.save(function(ok){
                    if (!ok){
                        console.log("chatroom sheet not created");
                        workbook.cancel();
                    }
                    else{
                        console.log('congratulations, chatroom sheet created');
                    }
                });*/
            }
        });
    } else if(sql == sqlChat){
        connection.query(sql, function(err, rows){
            if(err){throw err;}
            else{
                var sheet = workbook.createSheet('chat', 8, rows.length+1);
                sheet.set(1,1, "customer_email");
                sheet.set(2,1,"password");
                sheet.set(3,1,"name");
                sheet.set(4,1,"phone");
                sheet.set(5,1,"img");
                sheet.set(6,1,"description");
                sheet.set(7,1,"date_sign");
                sheet.set(8,1,"date_login");

                for(var i=0; i<rows.length;i++){
                    sheet.set(1, i+2, rows[i].customer_email);
                    sheet.set(2, i+2, rows[i].password);
                    sheet.set(3, i+2, rows[i].name);
                    sheet.set(4, i+2, rows[i].phone);
                    sheet.set(5, i+2, rows[i].img);
                    sheet.set(6, i+2, rows[i].description);
                    sheet.set(7, i+2, rows[i].date_sign);
                    sheet.set(8, i+2, rows[i].date_login);
                }
                callback(cnt);

/*                // Save it
                workbook.save(function(ok){
                    if (!ok){
                        console.log("chat sheet not created");
                        workbook.cancel();
                    }
                    else{
                        console.log('congratulations, chat sheet created');
                    }
                });*/
            }
        });
    } else if(sql == sqlRates) {
        connection.query(sql, function(err, rows){
            if(err){throw err;}
            else{
                var sheet = workbook.createSheet('rates', 3, rows.length+1);
                sheet.set(1,1, "customer_email");
                sheet.set(2,1,"market_name");
                sheet.set(3,1,"rate");

                for(var i=0; i<rows.length;i++){
                    sheet.set(1, i+2, rows[i].customer_email);
                    sheet.set(2, i+2, rows[i].market_name);
                    sheet.set(3, i+2, rows[i].rate);
                }

                callback(cnt);
/*                // Save it
                workbook.save(function(ok){
                    if (!ok){
                        console.log("rate sheet not created");
                        workbook.cancel();
                    }
                    else{
                        console.log('congratulations, rateSheet created');
                    }
                });*/
            }
        });
    }
}

// do callback after all sheets are created
var callback = function(cnt){
    if(cnt == arrSql.length-1){
        // Save it
        workbook.save(function(ok){
            if (!ok){
                workbook.cancel();
                console.log("sheet not created");
            }
            else{
                console.log('congratulations, sheet created');
            }
        });
        console.log("all query is done : " + cnt);
    }
}

console.log("arrSql size : " + arrSql.length);

// create excel sheets for each table
for(var i=0; i<arrSql.length; i++){
    console.log("arrSql  : " + arrSql[i]);
    addSheets(arrSql[i], i, callback);
}
