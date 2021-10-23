var db = require('../../db');

module.exports.getFullBill = (req,res)=>{
    const sql = "SELECT * FROM `order`";
    db.query(sql,(err,rows)=>{
        if(err){
            return res.json({msg:err});
        }else{
            return res.json(rows)
        }
    })
}

module.exports.updateStatusBill = (req,res)=>{
    const {code_order,status} = req.body;
    const sql = "UPDATE `order` SET status=? WHERE code_order = ?";
    db.query(sql,[status,code_order],(err,rows)=>{
        if(err){
            return res.json({msg:err});
        }else{
            return res.json({msg:"Success"})
        }
    })
}