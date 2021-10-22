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

module.exports.getProductNew = (req,res)=>{
    const {page} = req.params;
    const sqlFull = `SELECT * FROM product`
    db.query(sqlFull, (err,result)=>{
        if(err){
            return res.json({msg:err});
        }
        result.sort((a,b)=>{
            return new Date(b.create_at) - new Date(a.create_at);
        });
        let item = [];
        let numberofpage = 8;
        let maxlength = numberofpage*page;  
        if(result.length>maxlength){
            for(var i=maxlength-8;i<maxlength;i++){
                item.push(result[i])
                if(i===maxlength-1){
                    return res.json({msg:"Still data",item:item})
                }
            } 
        }else{
            for(var i=maxlength-8;i<result.length;i++){
                item.push(result[i])
                if(i===result.length-1){
                    return res.json({msg:"Out of data",item:item})
                }
            } 
        }
    })
}
module.exports.getProductDeal = (req,res)=>{
    const {page} = req.params;
    const sqlFull = `SELECT * FROM product`;
    db.query(sqlFull, (err,result)=>{
        if(err){
            return res.json({msg:err});
        }
        result.sort((a,b)=>{
            let aP = 0;
            let bP = 0;
            if(a.promotional!==null){
                aP=(a.price-a.promotional)/a.price
            }
            if(b.promotional!==null){
                bP=(b.price-b.promotional)/b.price
            }
            return bP - aP;
        });
        let item = [];
        let numberofpage = 8;
        let maxlength = numberofpage*page;  
        if(result.length>maxlength){
            for(var i=maxlength-8;i<maxlength;i++){
                item.push(result[i])
                if(i===maxlength-1){
                    return res.json({msg:"Still data",item:item})
                }
            } 
        }else{
            for(var i=maxlength-8;i<result.length;i++){
                item.push(result[i])
                if(i===result.length-1){
                   return res.json({msg:"Out of data",item:item})
                }
            } 
        }
    })
}