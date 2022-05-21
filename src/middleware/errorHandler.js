const logError = (err) => {
  console.log('INSIDE');
  console.error(err)
 }
 
const logErrorMiddleware = (err, req, res, next) => {
  console.log('THIS IS ERROR MIDDLEWARE');
  logError(err)
  next(err)
 }
 
const returnError = (err, req, res, next) => {
  console.log('INSIDE RETURN ERROR');
  res.status(err.statusCode || 500).json({error: {
    statusCode: err.statusCode,
    reason: err.name,
    message: err.message
  }})
 }
 
const isOperationalError = (error) => {
  if (error instanceof BaseError) {
  return error.isOperational
  }
  return false
 }
 
 module.exports = {
  logError,
  logErrorMiddleware,
  returnError,
  isOperationalError
 }