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
        const decoded = jwt.verify(theToken, process.env.SECRECT);
        const sql = 'SELECT id,username,name,email,avartar,ruler FROM user WHERE id = ? ';
        db.query(sql,[decoded.id],(err,rows,fields)=>{
            if (err) {
                return res.json({msg:err});
            }else{
                return res.json(rows);
            }
        })
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