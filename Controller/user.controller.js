var db = require('../db');

module.exports.getUser = (req,res)=>{
    const sql = "SELECT * FROM user"
    db.query(sql, (err,result)=>{
       return res.send(result);
    })
}