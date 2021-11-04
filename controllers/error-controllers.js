//catch and send any error with a status and message
exports.handleCustomErrors = (err, req, res, next) => {

    if (err.status && err.message) {
        res.status(err.status).send({
            message: err.message
        });
    } else {
        next(err)
    }
};

//Handle any server errors
exports.handle500Errors = (err, req, res, next) => {
    console.log(err)
    res.status(500).send({
        message: "Internal Server Error",
    });
};
