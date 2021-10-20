var db = require('../db');
const uuid = require('uuid');

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
            arr.push({...rows,"quanity":item.quanity,"option":item.option});
            if(index===objData.length-1){
                return res.json(arr)
            }
        })
        
    }
    )

}

module.exports.addBill = (req,res)=>{
    let {name,address,email,phone,total_price,message,dataProduct,methodPayment,user} =req.body;
    if(user===""){
        user=null;
    }
    const code_order = "order_"+uuid.v4()
    const status = 0;
    const values = [code_order,user,name,address,email,phone,total_price,message,status,methodPayment];
    const sql_Order = "INSERT INTO `order` (`code_order`,`idUser`, `name`,`address`,`email`,`phone`,`total_price`,`message`,`status`,`method_payment`) VALUES (?,?,?,?,?,?,?,?,?,?)";
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
                const data = [code_order,idProduct,quanity,price,size];
                const sql_Order_Details = "INSERT INTO `order_details` (`idOrder`,`idProduct`,`quanity`,`price`,`size`) VALUES (?,?,?,?,?)";
                db.query(sql_Order_Details,data,(err)=>{
                    if(err){
                        return res.json({msg:err});
                    }
                    const sql_get_Inventory = "SELECT sold FROM inventory WHERE idProduct = ? AND size = ? ";
                    db.query(sql_get_Inventory,[idProduct,size],(err,rows)=>{
                        if(err){
                            return res.json({msg:err});
                        }
                        const new_sold = rows[0].sold+quanity;
                        const sql_add_sold = "UPDATE inventory SET sold = ? WHERE idProduct = ? AND size = ?"
                        db.query(sql_add_sold,[new_sold,idProduct,size])
                    })
                    if(index==dataProduct.length-1){
                        return res.json({msg:"success"})
                    }
                })
            })  
        }
    })
}