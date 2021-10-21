const db = require('../db')
module.exports.getSaleByCode = (req,res)=>{
    const {code} = req.body;
    const sql = "SELECT * FROM sale WHERE code_sale = ?";
    db.query(sql,[code],(err,rows)=>{
        if(err){
            return res.json({msg:err});
        }
        if(rows.length<1){
            return res.json({
                msg:"Sale not exist"
            })
        }
        else{
            return res.json(rows)
        }
    })
}
module.exports.getSaleById = (req,res)=>{
    const {idSale} = req.body;
    const sql = "SELECT * FROM sale WHERE id = ?";
    db.query(sql,[idSale],(err,rows)=>{
        if(err){
            return res.json({msg:err});
        }
        if(rows.length<1){
            return res.json({
                msg:"Sale not exist"
            })
        }
        else{
            return res.json(rows)
        }
    })
}