const { storage } = require('debug/src/browser');
const multer = require('multer');

const diskstorage =  multer.diskStorage({
    destination: function(req,file,cb){
        cb(null,'./images/');
    },
    filename: function(req,file,cb){
    cb(null, new Date().toISOString() + file.originalname);
    }
});
const upload = multer({ storage :diskstorage}).single('itemImage');

module.exports = upload;
