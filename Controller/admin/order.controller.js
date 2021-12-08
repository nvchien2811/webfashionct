var db = require('../../db');
const Email = require('../sendEmail.controller');
module.exports.getFullBill = (req,res)=>{
    const sql = "SELECT * FROM `order`";
    db.query(sql,(err,rows)=>{
        if(err){
            return res.json({msg:err});
        }else{
            return res.json(rows)
        }
    })
}

module.exports.updateStatusBill = (req,res)=>{
    const {code_order,status,email} = req.body;
    const sql = "UPDATE `order` SET status=? WHERE code_order = ?";
    db.query(sql,[status,code_order],(err,rows)=>{
        if(err){
            return res.json({msg:err});
        }else{
            if(status===1){
                Email.SendEmail(email,`Cập nhật đơn hàng #${code_order}`,
                    `Đơn hàng #${code_order} của bạn hiện đang trong <b style="color:blue">trạng thái giao hàng</b> !<br/>
                    Chúng tôi sẽ thông tin trạng thái đơn hàng trong email tiếp theo.<br/>
                    Bạn vui lòng kiểm tra email thường xuyên nhé !
                    `
                )
            }
            if(status===2){
                Email.SendEmail(email,`Hoàn thành đơn hàng #${code_order}`,
                `Đơn hàng #${code_order} <b style="color:green">đã hoàn thành</b>, hãy kiểm tra lại !<br/>
                Nếu có vấn đề gì hãy liên hệ với chúng tôi. <br/>
                Vào website hoặc ứng dụng di động để đánh giá và bình luận sản phẩm ngay. <br/>
                Cảm ơn bạn đã lựa chọn cửa hàng cửa hàng của chúng tôi !!
                `
            )
            }
            if(status===3){
                Email.SendEmail(email,`Cập nhật đơn hàng #${code_order}`,
                    `Đơn hàng #${code_order} của bạn <b style="color:gray">đã hủy</b> thành công !<br/>
                    Nếu có thắc mắc hay vấn đề gì vui lòng liên hệ với chúng tôi ! <br/>
                    `
                )
            }
            return res.json({msg:"Success"})
        }
    })
}
module.exports.deleteBill = (req,res)=>{
    const {code_order} = req.body;
    const sql_select_product = "SELECT `size`,`idProduct`,`quanity` FROM `order_details` WHERE idOrder = ?";
    db.query(sql_select_product,[code_order],(err,rows)=>{
        if(err){
            return res.json({msg:err});
        }else{
            rows.map((item)=>{
                updateQuanityInventory(item.size,item.idProduct,item.quanity)
            });
            const sql_delete_details = "DELETE FROM `order_details` WHERE `idOrder`= ?";
            db.query(sql_delete_details,[code_order],(err,rows)=>{
                if(err){
                    return res.json({msg:err});
                }else{
                    const sql_delete_order = "DELETE FROM `order` WHERE `code_order`=?"
                    db.query(sql_delete_order,[code_order],(err,rows)=>{
                        if(err){
                            return res.json({msg:err});
                        }else{
                            return res.json({msg:"Success"})
                        }
                    })
                }
            })
        }
    })
}
const updateQuanityInventory = (size,idProduct,quanity)=>{
    const sql = "SELECT `sold` FROM `inventory` WHERE idProduct = ? AND size = ?"
    db.query(sql,[idProduct,size],(err,rows)=>{
        if(err){
            return res.json({msg:err});
        }else{
            const newSold = rows[0].sold-quanity;
            const update = "UPDATE `inventory` SET `sold` = ? WHERE idProduct = ? AND size = ? ";
            db.query(update,[newSold,idProduct,size],(err,rows)=>{
                if(err){
                    return res.json({msg:err});
                }
            })
        }
    })
}
