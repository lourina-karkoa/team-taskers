function checkImage(req, res, next) {
    if (!req.file) {
        return res.status(400).json({state: "failed" , message: "Image is required" , data : null});
    }
    next(); 
}

module.exports = checkImage;
