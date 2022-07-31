var db = require('../db');
const uuid = require('uuid');
const Email = require('./sendEmail.controller');
const getPriceVND = require('./util/getPriceVND');
module.exports.getProductByCart = (req,res)=>{
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
// favorite
module.exports.getProductFavorite = (req,res)=>{
    const {data} = req.body;
    const objData = JSON.parse(data);
    if(objData===null){
        return;
    }
    const sql = "SELECT product.*,AVG(review.reviewStar) AS reviewStar,COUNT(*) AS quanityReview FROM `product` LEFT JOIN `review` ON product.id=review.idProduct WHERE product.id=? GROUP BY product.id HAVING quanityReview";
    let arr = [];
    objData.map((item,index)=>{
        db.query(sql,[item.id],async(err,rows,fields)=>{
            if(err){
                console.log(err)
            }
            // rows.concat({"quanity":item.quanity,"option":item.option});
            arr.push({...rows,"quanity":item.name});
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
            let str_product = "";
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
                    str_product = str_product+`  
                        <tr style="border: 1px solid black">
                            <td>
                                ${item[0].name}
                            </td>
                            <td>
                                ${size}
                            </td>
                            <td style="text-align: center">
                                ${quanity}
                            </td>
                            <td>
                                ${getPriceVND.getPriceVND(price*quanity)} đ
                            </td>
                        </tr>
                        
                    `
                    if(idSale!==null){
                        handleEditSale(idSale)
                    }
                    if(index==dataProduct.length-1){
                        const detail_Bill = ` 
                        - Địa chỉ giao hàng : ${address}<br/>
                        - Ngày đặt : ${new Date(Date.now()).toString()}<br/>
                        - Tình trạng : <b>Đang xử lý </b><br/>
                        <table style="border: 1px solid black;width: 80%;border-collapse: collapse">
                           <tr style="border: 1px solid black">
                           <td >
                               <b> Sản phẩm </b>
                           </td>
                           <td >
                                <b> Size/Màu sắc </b>
                            </td>
                           <td style="text-align: center">
                               <b>Số lượng</b>
                           </td>
                           <td>
                               <b>Tạm tính</b>
                           </td>
                           </tr>
                           ${str_product}
                        </table>
                        <b>Tổng tiền: ${getPriceVND.getPriceVND(total_price)} đ</b> 
                        `
                        //Send mail for customer
                        Email.SendEmail(email,"CTFASHION-Đặt hàng thành công",
                            `
                            Chào ${name}. <br/>
                            Cảm ơn bạn đã mua sắm tại CT Fashion. <br/>
                            - Mã đơn hàng của bạn là : #${code_order}<br/>
                            ${detail_Bill}<br/>
                            Chúng tôi sẽ thông tin trạng thái đơn hàng trong email tiếp theo.<br/>
                            Bạn vui lòng kiểm tra email thường xuyên nhé !
                            `
                        )
                        //Send email for admininstrator
                        Email.SendEmail(process.env.EMAIL,`Đơn hàng mới #${code_order}`,
                            `
                            - Tên khách hàng : ${name} <br/>
                            - Email đặt hàng : ${email} <br/>
                            - Số điện thoại đặt hàng : ${phone} <br/>
                            ${detail_Bill}
                            `
                        )
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
    const sql = "SELECT order_details.*,review.reviewStar,review.comment,product.image FROM `order_details` LEFT JOIN `review` ON order_details.idReview=review.id INNER JOIN `product` ON order_details.idProduct=product.id WHERE idOrder = ?";
    db.query(sql,[idOrder],(err,rows)=>{
        if(err){
            return res.json({msg:err});
        }else{
            return res.json(rows)
        }
    })
}
