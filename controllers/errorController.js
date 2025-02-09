const AppError = require('./../utils/appError');

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (err) => {
  const value = err.keyValue.name;
  const message = `Duplicate field value: ${value}. Please use another value!`;
  return new AppError(message, 400);
};

const handleValidtaionErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Invalid Input data. ${errors.join('. ')}`;
  return new AppError(message, 400);
};

const handleJWTError = () =>
  new AppError('Invalid Token. Please Login Again!', 401);

const handleJWTExpiredError = () =>
  new AppError('Your Token has Expired. Please Log in Again. ', 401);

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorProd = (err, res) => {
  // Operational, trusted error: send message to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });

    // Programming or other unknown error: don't leak error details to the client
  } else {
    //1) Log error
    console.error('ERROR 💥', err);

    // 2) send generate message
    res.status(500).json({
      status: 'error',
      message: 'Something went wrong!',
    });
  }
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    // // 1) Invalid ID
    let error = { ...err };

    if (err.name === 'CastError') error = handleCastErrorDB(error);

    // 2) Duplicates
    if (error.code === 11000) error = handleDuplicateFieldsDB(error);
    // 3) Validation error
    if (err.name === 'ValidationError') error = handleValidtaionErrorDB(error);

    // JsonWebTokenError
    if (error.name === 'JsonWebTokenError') error = handleJWTError();

    // TokenExpiredError
    if (error.name === 'TokenExpiredError') error = handleJWTExpiredError();
    sendErrorProd(error, res);
  }
};
