const db = require('../../db');

module.exports.getFullUser = (req,res)=>{
    const sql = "SELECT * FROM user WHERE id NOT IN (SELECT id WHERE ruler=1)"
    db.query(sql, (err,result)=>{
        if(err){
            return res.json({msg:err});
        }else{
            return res.json(result)
        }
    })
}
module.exports.updateStatusUser = (req,res)=>{
    const {id,status} = req.body;
    const sql = "UPDATE user SET status = ? WHERE id = ?";
    db.query(sql,[status,id],(err,rows)=>{
        if(err){
            return res.json({msg:err});
        }else{
            return res.json({msg:"Success"})
        }
    })
}