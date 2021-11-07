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

module.exports.editProductType = (req,res)=>{
    const {id,idCategory,name,status} = req.body.data;
    const slug = slugify(name);
    const sql = "UPDATE product_type SET name=?,idCategory=?,slug=?,status=? WHERE id = ?";
    db.query(sql,[name,idCategory,slug,status,id],(err,rows)=>{
        if(err){
            return res.json({msg:err})
        }else{
            return res.json({msg:"Success"})
        }
    })
}
module.exports.addProducType = (req,res)=>{
    const {name,idCategory,status} = req.body.data;
    const slug = slugify(name);
    const id = uuid.v4()
    const sql = "INSERT INTO product_type(id,name,slug,idCategory,status) VALUES (?,?,?,?,?)";
    db.query(sql,[id,name,slug,idCategory,status],(err,rows)=>{
        if(err){
            return res.json({msg:err})
        }else{
            return res.json({msg:"Success"})
        }
    })
}
module.exports.addCategory = (req,res)=>{
    const {name,status} = req.body.data;
    const {logo} = req.body;
    const slug = slugify(name);
    const id = uuid.v4();
    const sql = "INSERT INTO category(id,name,slug,logo,status) VALUES (?,?,?,?,?)";
    db.query(sql,[id,name,slug,logo,status],(err,rows)=>{
        if(err){
            return res.json({msg:err})
        }else{
            return res.json({msg:"Success"})
        }
    })
}
module.exports.editCategory = (req,res)=>{
    const {id,name,status} = req.body.data;
    const {logo} = req.body;
    const slug = slugify(name);
    const sql = "UPDATE category SET name=?,slug=?,status=?,logo=? WHERE id = ?";
    db.query(sql,[name,slug,status,logo,id],(err,rows)=>{
        if(err){
            return res.json({msg:err})
        }else{
            return res.json({msg:"Success"})
        }
    })
}

module.exports.deleteProduct = (req,res)=>{
    const {id} = req.body;
    const sql_delete_inventory = "DELETE FROM inventory WHERE idProduct = ?";
    db.query(sql_delete_inventory,[id],(err,rows)=>{
        if(err){
            return res.json({msg:err});
        }else{
            const sql_delete_product = "DELETE FROM product WHERE id = ?";
            db.query(sql_delete_product,[id],(err,rows)=>{
                if(err){
                    return res.json({msg:err});
                }else{
                    return res.json({msg:"Success"});
                }
            })
        }
    })
}

module.exports.statisProductSold = (req,res)=>{
    const sql = "SELECT idProduct, COUNT(*) AS soldProduct, product.name AS nameProduct FROM `order_details` INNER JOIN `product` ON order_details.idProduct=product.id GROUP BY idProduct HAVING soldProduct ORDER BY soldProduct DESC";
    db.query(sql,(err,result)=>{
        if(err){
            return res.json({msg:err});
        }else{
            return res.json(result)
        }
    })
}