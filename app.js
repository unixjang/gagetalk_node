var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var multer = require('multer');
var session = require('express-session');
var os = require('os');
var sys = require('sys');

// mysql을 쓰기 떄문에 아래 추가
var connection = require('./database/mysql_pool');

connection.connect();
console.log('OS NETWORK INTERFACES : ');
console.dir(os.networkInterfaces());

// keepalive();
function keepalive() {
    connection.query('select 1', [], function (err, result) {
        if (err) return console.log(err);
    });
}
setInterval(keepalive, 1000 * 60 * 5);
// => included by unix.jang


/*
 var mongo = require('mongodb'),
 dbHost = '127.0.0.1',
 dbPort = 27017;
 var Db = mongo.Db;
 var Connection = mongo.Connection;
 var Server = mongo.Server;
 var db = new Db ('local', new Server(dbHost, dbPort), {safe:true});

 // mongodb test
 db.open(function(error, dbConnection){
 if (error){
 console.error(error);
 process.exit(1);
 }
 console.log('db state: ', db._state);
 item = {
 name: 'Azat'
 }
 dbConnection.collection('messages').insert(item,
 function(error, item){
 if(error) {
 console.error(error);
 process.exit(1);
 }
 console.info('created/inserted: ',  item);
 db.close();
 process.exit(0);
 });
 });
 */

// unix.jang => setup routers

// express
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
// app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
// app.use(bodyParser.json({uploadDir: './public/images'}));
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(session({
    secret: '' + new Date().getTime(),
    cookie: {secure: false},
    resave: true,
    saveUninitialized: true
}));
app.use(require('less-middleware')(path.join(__dirname, 'public')));
// app.use(express.bodyParser({uploadDir: './public/images'}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'node_modules/angular')));
app.use(express.static(path.join(__dirname, 'node_modules/angular-route')));
app.use(express.static(path.join(__dirname, 'node_modules/angular-animate')));
/*
app.use(multer({
    dest: "./public/uploads/"
}));
*/

// unix.jang => use the setted routers
// web page
var checklogin = require('./routes_webpage/checklogin');
var index = require('./routes_webpage/index');
var owner_manage = require('./routes_webpage/owner_manage');
var customer_manage = require('./routes_webpage/customer_manage');
app.use('/checklogin', checklogin);
app.use('/', index);
app.use('/owner_manage', owner_manage);
app.use('/customer_manage', customer_manage);
// web chat test page
var chatapp = require('./routes_webpage/chatapp');
var chatapp_customer = require('./routes_webpage/chatapp_customer');
var chatapp_owner = require('./routes_webpage/chatapp_owner');
app.use('/chatapp', chatapp);
app.use('/chatapp_customer', chatapp_customer);
app.use('/chatapp_owner', chatapp_owner);

// device page
// customer
var CustomerMarketTask = require('./routes_customer/CustomerMarketTask');
var CustomerLoginTask = require('./routes_customer/CustomerLoginTask');
var CustomerSignupTask = require('./routes_customer/CustomerSignupTask');
var CustomerAccountTask = require('./routes_customer/CustomerAccountTask');
var CustomerRoomTask = require('./routes_customer/CustomerRoomTask');
var CustomerChatTask = require('./routes_customer/CustomerChatTask');
app.use('/CustomerMarketTask', CustomerMarketTask);
app.use('/CustomerLoginTask', CustomerLoginTask);
app.use('/CustomerSignupTask', CustomerSignupTask);
app.use('/CustomerAccountTask', CustomerAccountTask);
app.use('/CustomerRoomTask', CustomerRoomTask);
app.use('/CustomerChatTask', CustomerChatTask);
// owner
var OwnerLoginTask = require('./routes_owner/OwnerLoginTask');
var OwnerSignupTask = require('./routes_owner/OwnerSignupTask');
app.use('/OwnerLoginTask', OwnerLoginTask);
app.use('/OwnerSignupTask', OwnerSignupTask);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

module.exports = app;