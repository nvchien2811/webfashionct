var db = require('../../db');
var slugify = require('slugify');
var uuid = require('uuid')
module.exports.addProduct = (req,res)=>{
    const id = uuid.v4();
    const {name,price,promotional,image,idCategory,idProductType,imageDecription1,imageDecription2,imageDecription3,imageDecription4,description} = req.body;
    const slug = slugify(name);
    const sqlAdd = "INSERT INTO product (id,name,slug,price,promotional,image,idCategory,idProductType,imageDecription1,imageDecription2,imageDecription3,imageDecription4,description) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?)";
    db.query(sqlAdd,[id,name,slug,price,promotional,image,idCategory,idProductType,imageDecription1,imageDecription2,imageDecription3,imageDecription4,description],(err,rows)=>{
        if(err){
            return res.json({msg:err});
        }else{
            return res.json({msg:"Success"})
        }
    })
}

module.exports.editProduct = (req,res)=>{
    const {id,name,price,promotional,image,idCategory,idProductType,imageDecription1,imageDecription2,imageDecription3,imageDecription4,description} = req.body.data;
    const sql = "UPDATE product SET name=?,price=?,promotional=?,image=?,idCategory=?,idProductType=?,imageDecription1=?,imageDecription2=?,imageDecription3=?,imageDecription4=?,description=? WHERE id=?"
    db.query(sql,[name,price,promotional,image,idCategory,idProductType,imageDecription1,imageDecription2,imageDecription3,imageDecription4,description,id],(err,result)=>{
        if(err){
            return res.json({msg:err})
        }else{
            return res.json({msg:"Success"})
        }
    })
}