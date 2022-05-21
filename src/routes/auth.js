const express = require('express');
const { body } = require('express-validator');

const User = require('../models/user');
const authController = require('../controllers/auth');
const router = express.Router();

router.post('/signup', [
  body('email').isEmail().withMessage('Enter a valid email.')
  .custom((value, {req}) => {
    return User.findOne({email: value}).then(doc => {
      if(doc) {
        return Promise.reject('A user with this email already exist');
      }
    })
  })
  .normalizeEmail(),
  body('password').trim().isLength({min: 8}),

  body('name').trim().not().isEmpty(),
], authController.signup)

router.post('/login', authController.login)

module.exports = router