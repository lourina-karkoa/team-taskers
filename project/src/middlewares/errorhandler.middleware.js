const errorHandler = (err, req, res, next) => {
    return res.status(500).json({ state:"failed" , error: err.message , data: null  });
}

module.exports = errorHandler