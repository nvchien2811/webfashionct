var db = require('../../db');

module.exports.getFullInventory = (req,res)=>{
    const sql = "SELECT inventory.*, product.name,product.image FROM `inventory` INNER JOIN `product` ON inventory.idProduct=product.id"
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
module.exports.addInventory = (req,res)=>{
    const {idProduct,option,quanity} = req.body;
    const check = "SELECT * FROM `inventory` WHERE `idProduct`= ? AND `size`=?";
    db.query(check,[idProduct,option,quanity],(err,rows)=>{
        if(err){
            return res.json({msg:err});
        }
        if(rows.length > 0 ){
            return res.status(201).json({
                msg: "The product exist",
            });
        }
        else{
            const add = "INSERT INTO `inventory` (`idProduct`,`quanity`,`sold`,`size`,`status`) VALUES (?,?,?,?,?)"
            db.query(add,[idProduct,quanity,0,option,0],(err,rows)=>{
                if(err){
                    return res.json({msg:err});
                }
                else{
                    return res.json({msg:"Success"})
                }
            })
        }
    })
}

module.exports.deleteItemInventory = (req,res)=>{
    const {id} = req.body;
    const sql = "DELETE FROM `inventory` WHERE id = ?";
    db.query(sql,[id],(err,rows)=>{
        if(err){
            return res.json({msg:err});
        }else{
            return res.json({msg:"Success"})
        }
    })
}