const { validationResult } = require('express-validator')
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const Api422Error = require('../error/Api422Error');
const Api401Error = require('../error/Api401Error');
const Api500Error = require('../error/Api500Error');
const bcrypt = require('bcryptjs');

exports.signup = async (req, res, next) => {
  try {
    const errors = validationResult(req)
    if(!errors.isEmpty()) {
      throw new Api422Error(errors.array())
    }
    const name = req.body.name
    const email = req.body.email
    const password = req.body.password
    bcrypt.hash(password, 12).then((hashedPassword) => {
      const user = new User({
        email: email,
        password: hashedPassword,
        name: name,
      })
      return user.save()
    })
    .then((createdUser) => {
      res.status(201).json({
        message: 'User created!',
        userId: createdUser._id
      })
    })
    .catch(err => {
      throw new Api500Error(err.message)
    })

  } catch (err) {
    if(!err.statusCode) {
      err.statusCode = 500
    }
    next(err)
  }
}

exports.login = (req, res, next) => {
  const email = req.body.email
  const password = req.body.password
  let loadedUser
  User.findOne({email: email}).then(user => {
    console.log('user: ', user);
    console.log('ENTERED PW: ', password);
    console.log('ENTERED EMAIL: ', email);
    if(!user) {
      console.log('inside 404 error if');
      throw new Api401Error('Wrong email or password')
    }
    loadedUser = user
    return bcrypt.compare(password, user.password)
  })
  .then(isEqual => {
    console.log('equal: ', isEqual);
    if(!isEqual) {
      console.log('error if equal');
      throw new Api401Error('Wrong email or password')
    }

    const date = new Date()

    const token = jwt.sign({
      id: loadedUser._id.toString(), 
      email: loadedUser.email, 
      access_role: loadedUser.accessRole,
      issued: date
    }, process.env.JWT_SECRET,
    {expiresIn: '60d'})

    res.status(200).json({
      user: loadedUser,
      token: token
    })
    
  })
  .catch(err => {
    if(!err.statusCode) {
      err.statusCode = 500
    }
    next(err)
  })
}