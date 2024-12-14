const multer = require('multer')

function createUploader(folderName) {
    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, `public/uploads/${folderName}`)
        },
        filename: function (req, file, cb) {
            cb(null, Date.now() + file.originalname)
        }
    })
    return multer({ storage: storage })
}
module.exports = {
    maincategoryUploader:createUploader("maincategory"),
    subcategoryUploader:createUploader("subcategory"),
    brandUploader:createUploader("brand"),
    productUploader:createUploader("product"),
    testimonialUploader:createUploader("testimonial"),
    userUploader:createUploader("user"),
}