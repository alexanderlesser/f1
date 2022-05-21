const express = require('express');
const driverController = require('../controllers/driver');
const { body } = require('express-validator');
const app = express();
const router = express.Router();

router.get('/:id', driverController.getDriverById)

router.post('/', [
  body('name').trim().isLength({min: 5}),
  body('constructor').trim().isLength({min: 5}),
], driverController.createDriver)

router.get('/', driverController.getDrivers)

module.exports = router;