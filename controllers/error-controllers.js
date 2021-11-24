//catch and send any error with a status and message
exports.handleCustomErrors = (err, req, res, next) => {
  if (err.status && err.message) {
    res.status(err.status).send({
      message: err.message,
    });
  } else {
    next(err);
  }
};

exports.handlePsqlErrors = (err, req, res, next) => {
  if ((err.code = 23502)) {
    res.status(400).send({
      message: 'Invalid Request',
    });
  } else {
    next(err);
  }
};

//Sends a response for any methods not supported
exports.methodNotAllowed = (req, res) => {
  res.status(405).send({
    message: 'Method Not Allowed',
  });
};
//Handle any server errors
exports.handle500Errors = (err, req, res, next) => {
  console.log(err);
  res.status(500).send({
    message: 'Internal Server Error',
  });
};
