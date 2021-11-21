var db = require('../db');
const uuid = require('uuid');
const Email = require('./sendEmail.controller');
module.exports.getProductByCart = (req,res)=>{
    const {data} = req.body;
    const objData = JSON.parse(data);
    if(objData===null){
        return;ipcon
    }
    const sql = "SELECT * FROM product WHERE id= ?";
    let arr = [];
    objData.map((item,index)=>{
        db.query(sql,[item.id],async(err,rows,fields)=>{
            if(err){
                console.log(err)
            }
            // rows.concat({"quanity":item.quanity,"option":item.option});
            arr.push({...rows,"quanity":item.quanity,"option":item.option,"status":false});
            if(index===objData.length-1){
                return res.json(arr)
            }
        })
        
    }
    )

}

//thêm mới
module.exports.getProductByCartApp = (req,res)=>{
    const {data} = req.body;
    const objData = JSON.parse(data);
    if(objData===null){
        return;
    }
    const sql = "SELECT * FROM product WHERE id= ?";
    let arr = [];
    objData.map((item,index)=>{
        db.query(sql,[item.id],async(err,rows,fields)=>{
            if(err){
                console.log(err)
            }
            // rows.concat({"quanity":item.quanity,"option":item.option});
            arr.push({...rows,"quanity":item.quanity,"option":item.option,"status":item.status});
            if(index===objData.length-1){
                return res.json(arr)
            }
        })        
    }
    )
}

module.exports.addBill = (req,res)=>{
    let {name,address,email,phone,total_price,message,dataProduct,methodPayment,user,idSale} =req.body;
    if(user===""){
        user=null;
    }
    const code_order = "order_"+uuid.v4()
    const status = 0;
    const values = [code_order,user,name,address,email,phone,total_price,message,status,methodPayment,idSale];
    const sql_Order = "INSERT INTO `order` (`code_order`,`idUser`, `name`,`address`,`email`,`phone`,`total_price`,`message`,`status`,`method_payment`,`idSale`) VALUES (?,?,?,?,?,?,?,?,?,?,?)";
    db.query(sql_Order,values,(err,rows,fields)=>{
        if(err){
            return res.json({msg:err});
        }
        else{
            // console.log(typeof(dataProduct));
            dataProduct.map((item,index)=>{
                const idProduct = item[0].id;
                let price = 0;
                if(item[0].promotional===null){
                    price = item[0].price;
                }else{
                    price = item[0].promotional;
                }
                const size = item.option;
                const quanity = item.quanity;
                const data = [code_order,idProduct,item[0].name,quanity,price,size];
                const sql_Order_Details = "INSERT INTO `order_details` (`idOrder`,`idProduct`,`name_product`,`quanity`,`price`,`size`) VALUES (?,?,?,?,?,?)";
                db.query(sql_Order_Details,data,(err)=>{
                    if(err){
                        return res.json({msg:err});
                    }
                    hanldeEditQuanityInventory(idProduct,size,quanity);
                    if(idSale!==null){
                        handleEditSale(idSale)
                    }
                    if(index==dataProduct.length-1){
                        return res.json({msg:"success"})
                    }
                })
            })  
        }
    })
}
const hanldeEditQuanityInventory =(idProduct,size,quanity)=>{
    const sql_get_Inventory = "SELECT sold FROM inventory WHERE idProduct = ? AND size = ? ";
    db.query(sql_get_Inventory,[idProduct,size],(err,rows)=>{
        if(err){
            return res.json({msg:err});
        }
        const new_sold = rows[0].sold+quanity;
        const sql_add_sold = "UPDATE inventory SET sold = ? WHERE idProduct = ? AND size = ?"
        db.query(sql_add_sold,[new_sold,idProduct,size])
    })
}
const handleEditSale = (idSale)=>{
    const sql_get_Quanity = "SELECT used FROM sale WHERE id = ? ";
    db.query(sql_get_Quanity,[idSale],(err,rows)=>{
        if(err){
            return res.json({msg:err});
        }
        const new_used = rows[0].used+1;
        const sql_add_used = "UPDATE sale SET used = ? WHERE id = ? "
        db.query(sql_add_used,[new_used,idSale])
    })
}
module.exports.getBillByIdUser = (req,res)=>{
    const {idUser} = req.body;
    const sql = "SELECT * FROM `order` WHERE idUser = ?";
    db.query(sql,[idUser],(err,rows)=>{
        if(err){
            return res.json({msg:err});
        }else{
            return res.json(rows)
        }
    })
}
module.exports.getBillById = (req,res)=>{
    const {idOrder} = req.body;
    const sql = "SELECT * FROM `order` WHERE code_order = ?";
    db.query(sql,[idOrder],(err,rows)=>{
        if(err){
            return res.json({msg:err});
        }else{
            return res.json(rows)
        }
    })
}
module.exports.getProductByIdBill = (req,res)=>{
    const {idOrder} = req.body;
    const sql = "SELECT order_details.*,review.reviewStar,review.comment FROM `order_details` LEFT JOIN `review` ON order_details.idReview=review.id WHERE idOrder = ?";
    db.query(sql,[idOrder],(err,rows)=>{
        if(err){
            return res.json({msg:err});
        }else{
            return res.json(rows)
        }
    })
}

module.exports.sendMail= (req,res)=>{
    Email.SendEmail("hvtrung.18it4@vku.udn.vn","Cảm ơn bạn đã đặt hàng !! ","<b>Kiểm tra đơn hàng của bạn ở đây</b> <br/> Đơn hàng của bạn là")
}