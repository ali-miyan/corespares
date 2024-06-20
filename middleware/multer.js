const multer = require('multer');

const storage = multer.diskStorage({
    destination: "public/categoryimages",
    filename: (req, file, callback) => {
        const filename = file.originalname;
        callback(null, filename)
    }
})

const category = multer({ storage: storage });
const uploadproduct = category.single('image')

module.exports = {
    uploadproduct
}

////////////////////////////////////////////////////multer-for -products//////////////////////////////////////////////////////////

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
    uploadproduct,
    uploadMultiple
}