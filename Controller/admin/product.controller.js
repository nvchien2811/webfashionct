var db = require('../../db');
var slugify = require('slugify');
var uuid = require('uuid')
module.exports.addProduct = (req,res)=>{
    const id = uuid.v4();
    const {name,price,promotional,image,idCategory,idProductType,imageDecription1,imageDecription2,imageDecription3,imageDecription4,decription} = req.body;
    const slug = slugify(name);
    const sqlAdd = "INSERT INTO product (id,name,slug,price,promotional,image,idCategory,idProductType,imageDecription1,imageDecription2,imageDecription3,imageDecription4,decription) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?)";
    db.query(sqlAdd,[id,name,slug,price,promotional,image,idCategory,idProductType,imageDecription1,imageDecription2,imageDecription3,imageDecription4,decription],(err,rows)=>{
        if(err){
            return res.json({msg:err});
        }else{
            return res.json({msg:"Success"})
        }
    })
}