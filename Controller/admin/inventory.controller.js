var db = require('../../db');

module.exports.getFullInventory = (req,res)=>{
    const sql = "SELECT * FROM `inventory`"
    db.query(sql,(err,result)=>{
        if(err){
            return res.json({msg:err});
        }else{
            return res.json(result)
        }
    })
}
module.exports.updateQuanityInventory = (req,res)=>{
    const {idProduct,size,quanity} = req.body;
    const sql = "UPDATE `inventory` SET quanity=? WHERE idProduct = ? AND size = ?";
    db.query(sql,[quanity,idProduct,size],(err,rows)=>{
        if(err){
            return res.json({msg:err});
        }else{
            return res.json({msg:"Success"})
        }
    })
}