/**
 * Created by hyochan on 2015-02-18.
 */
/**
 * Created by hyochan on 2014. 10. 15..
 */

const
    customer_table = "customer",
    owner_table = "owner",
    rates_table = "rates",
    chatroom_table = "chatroom",
    chat_table = "chat";

// 모듈 추출
// mysql을 쓰기 떄문에 아래 추가
var connection = require('./database/mysql_pool');

connection.connect();
connection.query('DROP TABLE IF EXISTS ' + customer_table);
connection.query('DROP TABLE IF EXISTS ' + owner_table);
connection.query('DROP TABLE IF EXISTS ' + rates_table);
connection.query('DROP TABLE IF EXISTS ' + chatroom_table);
connection.query('DROP TABLE IF EXISTS ' + chat_table);

MSG_TEXT = 0;
MSG_IMG = 1;
MSG_FILE = 2;
MSG_MOV = 3;

/*
 connection.query('CREATE TABLE authentication (' +
 'phone_number VARCHAR(32), ' +
 'rand_key integer, ' +
 'token integer)');
 */
connection.query('CREATE TABLE ' + customer_table + ' (' +
    'cus_id VARCHAR(32),' +
    'password VARCHAR(32), ' +
    'email VARCHAR(32), ' +
    'name VARCHAR(32), ' +
    'phone VARCHAR(16), ' +
    'img VARCHAR(32), ' +
    'description TEXT, ' +
    'date_sign datetime, ' +
    'date_login datetime, ' +
    'primary key(cus_id))'
);

connection.query('CREATE TABLE  ' + owner_table + ' (' +
    'mar_id VARCHAR(32), ' +
    'password VARCHAR(32), ' +
    'mar_name VARCHAR(32),' +
    'tel VARCHAR(16), ' +
    'phone VARCHAR(16), ' +
    'img VARCHAR(32), ' +
    'email VARCHAR(32), ' +
    'address VARCHAR(32), ' +
    'category VARCHAR(32), ' +
    'homepage VARCHAR(32), ' +
    'description TEXT, ' +
    'date_sign datetime, ' +
    'date_login datetime, ' +
    'primary key(mar_id))'
);

connection.query('CREATE TABLE  ' + rates_table + ' (' +
    'cus_key VARCHAR(32), ' +
    'mar_id VARCHAR(32), ' +
    'rate integer, ' +
    'primary key(cus_key, mar_id))'
);

connection.query('CREATE TABLE  ' + chatroom_table + ' (' +
    'mar_id VARCHAR(32), ' +
    'mar_name VARCHAR(32), ' +
    'cus_id VARCHAR(32), ' +
    'cus_name VARCHAR(32), ' +
    'message TEXT, ' +
    'type INTEGER, ' +
    'path VARCHAR(32), ' +
    'send_date DATETIME, ' +
    'read_msg INTEGER, ' +
    'sender VARCHAR(32), ' +
    'primary key(mar_id, cus_id))'
);


// value for read_msg
/*
 0 : 메시지 안읽음
 1 : 메시지 읽음
 */
connection.query('CREATE TABLE  ' + chat_table + ' (' +
    'num integer auto_increment, ' +
    'mar_id VARCHAR(32), ' +
    'mar_name VARCHAR(32), ' +
    'cus_id VARCHAR(32), ' +
    'cus_name VARCHAR(32), ' +
    'message TEXT, ' +
    'type INTEGER, ' +
    'path VARCHAR(32), ' +
    'send_date DATETIME, ' +
    'read_msg INTEGER, ' +
    'sender VARCHAR(32), ' +
    'primary key(num))'
);

connection.end();

