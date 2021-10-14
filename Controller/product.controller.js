var db = require('../db');

module.exports.getProductType = (req,res)=>{
    const sql = "SELECT * FROM product_type"
    db.query(sql, (err,result)=>{
       return res.send(result);
    })
}
module.exports.getCategory= (req,res)=>{
    const sql = "SELECT * FROM category"
    db.query(sql, (err,result)=>{
       return res.send(result);
    })
}
module.exports.getProduct= (req,res)=>{
    const sql = "SELECT * FROM product"
    db.query(sql, (err,result)=>{
       return res.send(result);
    })
}
module.exports.getProductDetails= (req,res)=>{
    const {id} = req.body;
    const sql = `SELECT * FROM product WHERE id='${id}'`;
    db.query(sql, (err,result)=>{
       return res.send(result);
    })
}
module.exports.getCategoryById= (req,res)=>{
    const {id} = req.body;
    const sql = `SELECT * FROM category WHERE id='${id}'`;
    db.query(sql, (err,result)=>{
       return res.send(result);
    })
}
module.exports.getProductTypeById= (req,res)=>{
    const {id} = req.body;
    const sql = `SELECT * FROM product_type WHERE id='${id}'`;
    db.query(sql, (err,result)=>{
       return res.send(result);
    })
}
module.exports.getProductByType= (req,res)=>{
    const {id} = req.body;
    const sql = `SELECT * FROM product WHERE idProductType='${id}'`;
    db.query(sql, (err,result)=>{
       return res.send(result);
    })
}
module.exports.getProductByCategory= (req,res)=>{
    const {id} = req.body;
    const sql = `SELECT * FROM product WHERE idCategory='${id}'`;
    db.query(sql, (err,result)=>{
       return res.send(result);
    })
}

module.exports.getProductInventory= (req,res)=>{
    const {id} = req.body;
    const sql = `SELECT * FROM inventory WHERE idProduct='${id}'`;
    db.query(sql, (err,result)=>{
       return res.send(result);
    })
}