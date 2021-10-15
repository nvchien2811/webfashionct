var db = require('../db');
const jwt = require('jsonwebtoken');

module.exports.getUser = (req,res)=>{
    try {
        const {token} = req.body;
        if(token==null){
            return res.status(422).json({
                msg: "Please provide the token",
            });
        }
        const theToken = token;
        const decoded = jwt.verify(theToken, 'the-super-strong-secrect');
        const sql = 'SELECT * FROM user WHERE id = ? ';
        db.query(sql,[decoded.id],(err,rows,fields)=>{
            if (err) {
                return res.json({msg:err});
            }else{
                return res.json(rows);
            }
        })
    } catch (error) {
        console.log(error)
    }
   
}

module.exports.login = (req,res)=>{
    const {username,password} = req.body;
    const sql = 'SELECT * FROM user WHERE username = ? AND password = ?';
    db.query(sql,[username, password],(err,rows,fields)=>{
        if (err) {
            return res.json({msg:err});
        }
        if(rows.length <=0 ){
            return res.status(422).json({
                msg: "Error",
            });
        }else{
            const theToken = jwt.sign({id:rows[0].id},'the-super-strong-secrect',{ expiresIn: '1h' });
            return res.json({
                msg:"Success",
                token:theToken
            });
        }
    })
}