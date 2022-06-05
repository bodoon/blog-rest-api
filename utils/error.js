module.exports.throwError = (
  msg = "Something went wrong",
  code = 500,
  data = null
) => {
  const error = new Error(msg);
  error.statusCode = code;
  error.data = data;
  throw error;
};

module.exports.forwardError = (err, nextFunc) => {
  if (!err.statusCode) {
    err.statusCode = 500;
  }

  nextFunc(err);
};
