exports.handleCustomErrors = (err, req, res, next) => {
    console.log(err);
    if (err.status && err.message) {
        res.status(err.status).send({
            message: err.message
        });
    } else {
        next(err)
    }
};

exports.handle500Errors = (err, req, res, next) => {
    res.status(500).send({
        message: "Internal Server Error",
    });
};
