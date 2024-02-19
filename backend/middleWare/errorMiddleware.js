const errorHandler = (err, req, res, next) => {

    const statusCode = res.statusCode ? res.statusCode : 500
    res.status(statusCode).json({
        message: err.message,
        // Display error stack in development mode only.
        stack: process.env.NODE_ENV === 'development' ? err.stack : null
    })
}

module.exports = errorHandler