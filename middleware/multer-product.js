const multer = require('multer');

const localStorage = multer.diskStorage({
    destination: "public/productimages",
    filename: (req, file, callback) => {
        const filename = file.originalname;
        callback(null, filename);
    }
});

const products = multer({ storage: localStorage });
const uploadMultiple = products.array('images', 5);

module.exports = {
    uploadMultiple
};
