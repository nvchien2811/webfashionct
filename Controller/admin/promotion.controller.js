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

module.exports.updateTimeSale = (req,res)=>{
    const {id,date_start,expired} = req.body;
    const sql = "UPDATE `sale` SET date_start = ?,expired = ? WHERE id = ?";
    db.query(sql,[date_start,expired,id],(err,rows)=>{
        if(err){
            return res.json({msg:err});
        }else{
            return res.json({msg:"Success"})
        }
    })
}
module.exports.updateQuanitySale = (req,res)=>{
    const {id,quanity} = req.body;
    const sql ="UPDATE sale SET quanity = ? WHERE id = ?";
    db.query(sql,[quanity,id],(err,rows)=>{
        if(err){
            return res.json({msg:err});
        }else{
            return res.json({msg:"Success"})
        }
    })
}

module.exports.addPromotion = (req,res)=>{
    const {name_event_sale,code_sale,cost_sale,quanity,date_start,expired} = req.body.data;
    const sql = "INSERT INTO sale(name_event_sale,code_sale,cost_sale,quanity,date_start,expired,used) VALUES (?,?,?,?,?,?,?)";
    db.query(sql,[name_event_sale,code_sale.toUpperCase(),cost_sale,quanity,date_start,expired,0],(err,rows)=>{
        if(err){
            return res.json({msg:err});
        }else{
            return res.json({msg:"Success"})
        }
    })
}
module.exports.deleteSale = (req,res)=>{
    const {id} = req.body;
    const sql = "DELETE FROM sale WHERE id = ?"
    db.query(sql,[id],(err,result)=>{
        if(err){
            console.log(err)
            return res.json({msg:err});
        }else{
            return res.json({msg:"Success"})
        }
    })
}