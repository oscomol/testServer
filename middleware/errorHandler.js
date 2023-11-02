const errorHandler = (err, req, res, next) => {

    const status = res.statusCode ? res.statusCode : 500;
    res.status(status);
    res.json({msg: err.message, isError: true});
}

module.exports = errorHandler;