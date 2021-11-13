const db = require('../db')
const uuid = require('uuid');

module.exports.getReviewById = (req,res)=>{
    const {id} = req.body;
    const sql ="SELECT * FROM review WHERE id = ?";
    db.query(sql,[id],(err,rows)=>{
        if(err){
            return res.json({msg:err});
        }else{
            return res.json(rows);
        }
    })
}

module.exports.addReview = (req,res)=>{
    const {idUser,idProduct,comment,reviewStar,idOrderDetails} = req.body;
    const id = uuid.v4();
    const sql = "INSERT INTO review(id,idUser,idProduct,comment,reviewStar,status) VALUES (?,?,?,?,?,?)";
    db.query(sql,[id,idUser,idProduct,comment,reviewStar,0],(err,rows)=>{
        if(err){
            return res.json({msg:err})
        }else{
            const sql_add_order = "UPDATE order_details SET idReview = ?  WHERE id = ?";
            db.query(sql_add_order,[id,idOrderDetails],(err,rows)=>{
                if(err){
                    return res.json({msg:err});
                }else{
                    return res.json({msg:"Success"})
                }
            })
        }
    })
}

module.exports.editReview = (req,res)=>{
    const {idReview,comment,reviewStar} = req.body;
    const sql = "UPDATE review SET reviewStar = ?, comment=? WHERE id = ?";
    db.query(sql,[reviewStar,comment,idReview],(err,rows)=>{
        if(err){
            return res.json({msg:err});
        }else{
            return res.json({msg:"Success"})
        }
    })
}

module.exports.getFullReview = (req,res)=>{
    const sql = "SELECT review.*,product.name AS nameProduct,product.image AS imageProduct,user.email AS emailUser FROM `review` INNER JOIN product ON review.idProduct=product.id INNER JOIN user ON review.idUser = user.id";
    db.query(sql,(err,result)=>{
        if(err){
            return res.json({msg:err});
        }else{
            return res.json(result);
        }
    })
}
