const db = require('../../db')

module.exports.getFullPromotion = (req,res)=>{
    const sql = "SELECT * FROM sale ORDER BY date_start DESC"
    db.query(sql, (err,result)=>{
        if(err){
            return res.json({msg:err});
        }else{
            return res.json(result)
        }
    })
}