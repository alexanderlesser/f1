const express = require('express');
const driverController = require('../controllers/driver');
const { body } = require('express-validator');
const router = express.Router();

router.get('/driver', driverController.getDrivers)

router.get('/driver/:id', driverController.getDriverById)

router.post('/post', [
  body('name').trim().isLength({min: 5}),
  body('constructor').trim().isLength({min: 5}),
], driverController.createDriver)

module.exports = router;