var express = require('express')
var app = express()
const bodyparser = require('body-parser');
const port = 5000;

var cors = require('cors')
app.use(cors());
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended:true}));

app.use("/product",require("./Route/product.route"));
app.use("/user",require("./Route/user.route"));


app.listen(port,()=>console.log(`Example app listening at http://localhost:${port}`))