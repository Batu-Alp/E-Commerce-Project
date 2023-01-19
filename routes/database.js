const mysql = require("mysql2");

const connection = mysql.createConnection({
    host: "localhost",
    port : 3306,
    user: "root",
    password: "Mydata13*batu",
    database: "login_register"
});


module.exports = connection;