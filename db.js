var mysql = require('mysql');

var con = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database:process.env.DATABASE
});
// const sql = "SELECT * FROM users"
// con.connect(function(err) {
//     if (err) throw err;
//        console.log("Connected!");
//        con.query(sql, (err, result)=> {
//           if (err) throw err;
//           console.log("Result: " + JSON.stringify(result));
//         });
// });
module.exports = con;
