const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

exports.signup = async (req, res, next) => {
  const errors = validationResult(req);
  try{
    if (!errors.isEmpty()) {
      let errArr = errors.array();
      
      const error = new Error(errArr[0].msg);
      error.statusCode = 422;
      throw error;
    }
    const {email,name,password} = req.body;
  console.log(email ,password);
  
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = new User({
      email: email,
      password: hashedPassword,
      name: name
    });
    const result = await user.save();
    console.log(result);
    res.status(201).json({ message: 'User created!', userId: result._id });
    
  } catch(error){
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const {email,password} = req.body;
    let loadedUser;
    const user = await User.findOne({ email: email })
    if (!user) {
      const error = new Error('A user with this email could not be found.');
      error.statusCode = 401;
      throw error;
    }
    loadedUser = user;
    const isEqual = bcrypt.compare(password, user.password);
    if (!isEqual) {
      const error = new Error('Wrong password!');
      error.statusCode = 401;
      throw error;
    }
    const token = jwt.sign(
      {
        email: loadedUser.email,
        userId: loadedUser._id.toString()
      },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    
    res.status(200).json({ token: token, userId: loadedUser._id.toString() });
    
  } catch (error) {
    next(error);
  } 
   
};
