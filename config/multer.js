const multer= require('multer');

//multer config
module.exports= multer({
    storage: multer.diskStorage({})

});