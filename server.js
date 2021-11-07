var express = require('express')
var app = express()
const bodyparser = require('body-parser');
const dotenv = require('dotenv');
dotenv.config({path: './.env'});

const port = 5000;

var cors = require('cors')
app.use(cors());
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended:true}));

// get image in file upload
app.use('/upload', express.static('upload'));
app.use('/uploads',require("./Route/upload.route"));
app.use("/product",require("./Route/product.route"));
app.use("/user",require("./Route/user.route"));
app.use("/order",require("./Route/order.route"));
app.use("/inventory",require("./Route/inventory.route"));
app.use("/promotion",require("./Route/promotion.route"));
app.use("/review",require("./Route/review.route"));

app.listen(port,()=>console.log(`App listening at http://localhost:${port}`))