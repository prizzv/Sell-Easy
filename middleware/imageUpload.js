const path = require('path');
const multer = require('multer');

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        let destinationPath ='public/uploads/';
        // console.log("Here");
        
        if(file.fieldname == "product_image"){
            // console.log(file.fieldname+" fieldname");
            destinationPath += "productImages/";
        }else if(file.fieldname == "profile_image"){
            destinationPath += "profileImages/";
        }
        cb(null, destinationPath);
    },
    filename: function (req, file, cb) {
        let extension = path.extname(file.originalname);
        cb(null, Date.now() + extension);
    }
});

var upload = multer({
    storage: storage,
    fileFilter: function (req, file, callback) {
        if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
            callback(null, true)
        } else {
            console.log('only jpg, jpeg and png file supported');
            callback(null, false)
        }
    },
});

module.exports = upload;