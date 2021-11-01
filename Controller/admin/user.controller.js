const db = require('../../db');

module.exports.getFullUser = (req,res)=>{
    const sql = "SELECT * FROM user"
    db.query(sql, (err,result)=>{
        if(err){
            return res.json({msg:err});
        }else{
            return res.json(result)
        }
    })
}