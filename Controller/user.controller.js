var db = require('../db');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const uuid = require('uuid');

module.exports.getUser = (req,res)=>{
    try {
        const {token} = req.body;
        if(token==null){
            return res.status(422).json({
                msg: "Please provide the token",
            });
        }
        const theToken = token;
        jwt.verify(theToken, process.env.SECRECT,(err,decoded)=>{
            if(err){
                return res.json({msg:err})
            }else{
                const sql = 'SELECT id,username,name,email,avartar,ruler,status FROM user WHERE id = ? ';
                db.query(sql,[decoded.id],(err,rows,fields)=>{
                    if (err) {
                        return res.json({msg:err});
                    }else{
                        return res.json(rows);
                    }
                })
            }
        });
      
    } catch (error) {
        return res.status(500).json({ msg: error.message });
    }
   
}
module.exports.register = (req,res)=>{
    try {
        const id = uuid.v1();
        const {email,password,username,name} = req.body;
        const ruler = 0;
      
        const sql = 'SELECT * FROM user WHERE email = ? ';
        db.query(sql,[email],async(err,rows,fields)=>{
            //Check email exist ?
            if(rows.length > 0 ){
                return res.status(201).json({
                    msg: "The E-mail already in use",
                });
            }
            //create password with code bcrypt
            const hashPass = await bcrypt.hash(password, 12);
            const sqlRegister = 'INSERT INTO `user`(`id`,`username`,`email`,`password`,`name`,`ruler`) VALUES(?,?,?,?,?,?)';
            db.query(sqlRegister,[id,username,email,hashPass,name,ruler],(err,rows,fields)=>{
                if (err) {
                    return res.json({msg:err});
                }
                return res.status(201).json({
                    success: "The user has been successfully inserted.",
                });
            })
        })
    }catch (error) {
        return res.status(500).json({ msg: err.message });
    } 
}
module.exports.login = (req,res)=>{
    try {
        const {username,password} = req.body;
        const sql = 'SELECT * FROM user WHERE username = ? ';
    
        db.query(sql,[username],async(err,rows,fields)=>{
            if (err) {
                return res.json({msg:err});
            }
            //Check account exist
            if(rows.length ===0 ){
                return res.status(422).json({
                    msg: "Invalid account",
                });
            }else{
                //Confirm password
                const passMatch = await bcrypt.compare(password,rows[0].password);
                if(!passMatch){
                    return res.status(422).json({
                        msg: "Incorrect password",
                    });
                }else{
                    const theToken = jwt.sign({id:rows[0].id},process.env.SECRECT,{ expiresIn: '1h' });
                    return res.json({
                        msg:"Success",
                        token:theToken
                    });
                }
            }
        })
    } catch (error) {
        return res.status(500).json({ msg: err.message });
    }
}

module.exports.checkEmail = (req,res)=>{
    const {email} = req.body;
    const sql = 'SELECT * FROM user WHERE email = ? ';
    db.query(sql,[email],async(err,rows,fields)=>{
        //Check email exist ?
        if(rows.length > 0 ){
            return res.status(201).json({
                msg: "The E-mail already in use",
            });
        }
        else{
            return res.json({success: "Continue register"})
        }
    }
    )
}
module.exports.checkUsername = (req,res)=>{
    const {username} = req.body;
    const sql = 'SELECT * FROM user WHERE username = ? ';
    db.query(sql,[username],async(err,rows,fields)=>{
        //Check email exist ?
        if(rows.length > 0 ){
            return res.status(201).json({
                msg: "The Username already in use",
            });
        }
        else{
            return res.json({success: "Continue register"})
        }
    }
    )
}

module.exports.getInforUser = (req,res)=>{
    const {idUser} = req.body;
    const sql = "SELECT user.*,customer.address,customer.phone,COUNT(`order`.id) AS totalBill FROM `user` LEFT JOIN customer ON user.id = customer.idUser INNER JOIN `order` ON user.id=`order`.idUser WHERE user.id= ?";
    db.query(sql,[idUser],(err,rows)=>{
        if(err){
            return res.json({msg:err});
        }else{
            return res.json(rows);
        }
    })
}

module.exports.updateProfile = (req,res)=>{
    const {id,name,email,address,phone} = req.body.data;
    const sql_update_user = "UPDATE user SET name = ? WHERE id = ?";
    const sql_check_customer ="SELECT * FROM customer WHERE idUser=?";
    db.query(sql_check_customer,[id],(err,rows)=>{
        if(err){
            return res.json({msg:err});
        }
        if(rows.length===0){
            const sql_insert = "INSERT INTO customer(idUser,email,address,phone,active) VALUES (?,?,?,?,?)";
            db.query(sql_insert,[id,email,address,phone,0],(err,rows)=>{
                if (err) {
                    return res.json({msg:err})
                }else{
                    return res.json({msg:"Success"})
                }
            })
        }else{
            const sql_update_customer = "UPDATE customer SET address = ?,phone=? WHERE idUser = ?"
            db.query(sql_update_customer,[address,phone,id],(err,rows)=>{
                if(err){
                    return res.json({msg:err})
                }else{
                    return res.json({msg:"Success"})
                }
            })
        }
        db.query(sql_update_user,[name,id])
    })
 
}
module.exports.updateAvatarUser = (req,res)=>{
    console.log("đã vào")
    const {IDUSER,URLIMAGE} = req.body;
    const sql = "UPDATE user SET avartar = ? WHERE id = ?"
    db.query(sql,[URLIMAGE,IDUSER], (err,result)=>{
        if(err){
            return res.json({msg:err});
        }else{
            return res.json({msg:"Success"})
        }
    })
}