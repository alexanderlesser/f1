const { validationResult } = require('express-validator')

exports.getDrivers = (req, res, next) => {
  res.status(200).json({
    data: {
      drivers: [],
    }
  })
}

exports.getDriverById = (req, res, next) => {
  res.status(200).json({
    data: {
      driver: {},
    }
  })
}

exports.createDriver = (req, res, next) => {
  const errors = validationResult(req)

  if(!errors.isEmpty()) {
    return res.status(422).json({
      message: 'Validation failed',
      error: errors.array()
    })
  }
}