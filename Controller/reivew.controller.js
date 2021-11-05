const db = require('../db')

module.exports.getReviewById = (req,res)=>{
    const {id} = req.body;
    const sql ="SELECT * FROM review WHERE id = ?";
    db.query(sql,[id],(err,rows)=>{
        if(err){
            return res.json({msg:err});
        }else{
            return res.json(rows);
        }
    })
}