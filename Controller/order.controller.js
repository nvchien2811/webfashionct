var db = require('../db');

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