const { validationResult } = require('express-validator')
const mongoose = require('mongoose')
const Driver = require('../models/driver')
const Api404Error = require('../error/Api404Error')
const Api500Error = require('../error/Api500Error')
const cloudinary = require('../setup/cloudinary')

exports.getDrivers = async (req, res, next) => {
  try {
  const drivers = await Driver.find({}).catch(err => {
    throw new Api500Error('Internal server error')
  });
  if(drivers.length === 0) {
    throw new Api404Error(`No drivers found`)
  }

  res.status(200).json({
    data: {
      drivers: drivers
    }
  })
  next()
} catch (err) {
  console.log('Inside catch error');
  if(!err.statusCode) {
    err.statusCode = 500
  }

  next(err)
}
}

exports.getDriverById = async (req, res, next) => {
  try {
  const id = req.params.id
  console.log(id);
  const driver = await Driver.findById(id).catch(err => {
    throw new Api500Error('Internal server error')
  })
  // const driver = await mongoose.Driver.findOne({_id: id}).catch((err) => {
  //   throw new Api404Error(`Driver with id:${id} was not found`)
  // })
  if(!driver) {
    throw new Api404Error(`Driver with id:${id} was not found`)
  }
  res.status(200).json({
    data: {
      driver: driver,
    }
  })
} catch (err) {
  console.log('inside the catch');
  next(err)
}
}

exports.createDriver = (req, res, next) => {
  const errors = validationResult(req)

  if(!errors.isEmpty()) {
    const error = new Error('Validation Failed')
    error.statusCode = 422
    throw error
  }
}