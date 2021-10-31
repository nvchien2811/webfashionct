const multer = require('multer');
const path = require('path');

const imageStorageProduct = multer.diskStorage({
    // Destination to store image     
    destination: (req, file, cb)=>{ // it is destination not desitnation :)
        console.log("storage");
        cb(null, './Upload/ImageProduct');
      }, 
      filename: (req, file, cb) => {
          cb(null, file.originalname + '_' + Date.now() 
             + path.extname(file.originalname))
            // file.fieldname is name of the field (image)
            // path.extname get the uploaded file extension
    }
});
const imageStorageProductDescription = multer.diskStorage({
  // Destination to store image     
  destination: (req, file, cb)=>{ // it is destination not desitnation :)
      console.log("storage");
      cb(null, './Upload/ImageDescription');
    }, 
    filename: (req, file, cb) => {
        cb(null, file.originalname + '_' + Date.now() 
           + path.extname(file.originalname))
          // file.fieldname is name of the field (image)
          // path.extname get the uploaded file extension
  }
});
module.exports.imageUploadProduct = multer({
    storage: imageStorageProduct,
    limits: {
      fileSize: 10000000 // 1000000 Bytes = 1 MB
    },
    fileFilter(req, file, cb) {
      if (!file.originalname.match(/\.(png|jpg)$/)) { 
         // upload only png and jpg format
         return cb(new Error('Please upload a Image'))
       }
     cb(undefined, true)
  }
}) 
module.exports.imageUploadProductDescription = multer({
  storage: imageStorageProductDescription,
  limits: {
    fileSize: 10000000 // 1000000 Bytes = 1 MB
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(png|jpg)$/)) { 
       // upload only png and jpg format
       return cb(new Error('Please upload a Image'))
     }
   cb(undefined, true)
}
}) 
module.exports.uploadImage = (req,res)=>{
    return res.json({msg:req.file})
}