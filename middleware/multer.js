const multer = require('multer');

const localStorage = multer.diskStorage({
    destination: "public/categoryimages",
    filename: (req, file, callback) => {
        const filename = file.originalname;
        callback(null, filename)
    }
})

const products = multer({ storage: localStorage });
const uploadproduct = products.single('image')

module.exports = {
    uploadproduct
}