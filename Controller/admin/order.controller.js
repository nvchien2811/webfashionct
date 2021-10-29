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
module.exports.deleteBill = (req,res)=>{
    const {code_order} = req.body;
    const sql_select_product = "SELECT `size`,`idProduct`,`quanity` FROM `order_details` WHERE idOrder = ?";
    db.query(sql_select_product,[code_order],(err,rows)=>{
        if(err){
            return res.json({msg:err});
        }else{
            rows.map((item)=>{
                updateQuanityInventory(item.size,item.idProduct,item.quanity)
            });
            const sql_delete_details = "DELETE FROM `order_details` WHERE `idOrder`= ?";
            db.query(sql_delete_details,[code_order],(err,rows)=>{
                if(err){
                    return res.json({msg:err});
                }else{
                    const sql_delete_order = "DELETE FROM `order` WHERE `code_order`=?"
                    db.query(sql_delete_order,[code_order],(err,rows)=>{
                        if(err){
                            return res.json({msg:err});
                        }else{
                            return res.json({msg:"Success"})
                        }
                    })
                }
            })
        }
    })
}
const updateQuanityInventory = (size,idProduct,quanity)=>{
    const sql = "SELECT `sold` FROM `inventory` WHERE idProduct = ? AND size = ?"
    db.query(sql,[idProduct,size],(err,rows)=>{
        if(err){
            return res.json({msg:err});
        }else{
            const newSold = rows[0].sold-quanity;
            const update = "UPDATE `inventory` SET `sold` = ? WHERE idProduct = ? AND size = ? ";
            db.query(update,[newSold,idProduct,size],(err,rows)=>{
                if(err){
                    return res.json({msg:err});
                }
            })
        }
    })
}
