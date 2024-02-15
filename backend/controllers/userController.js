const asyncHandler = require('express-async-handler')
const User = require('../models/User')
const jwt = require('jsonwebtoken')

const generateToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET, {expiresIn: '1d'})
}

// Register User
const registerUser = asyncHandler( async (req,res) => {
   const {name, email, password} = req.body
   // Check that all fields filled out.
   if (!name) {
    res.status(400)
    throw new Error('Please provide a name.')
   }
   if (!email) {
        res.status(400)
        throw new Error('Please provide an email address.')
   }
   if (!password) {
        res.status(400)
        throw new Error('Please provide a password.')
   }
   // Check password minimum length.
   if (password.length < 6) {
    res.status(400)
    throw new Error('Password must be at least 6 characters.')
   }
   // Check if user email already exists.
   const userExists = await User.findOne({email})
   if (userExists) {
    res.status(400)
    throw new Error('This email address has already been registered. Please choose a different one.')
   }
 
   // Create new user with provided name, email, and password
   const user = await User.create({
       // In ES6, if the property name matches the variable name, you can simply use the variable name
       name, email, password,
   });

   // Generate Token
   const token = generateToken(user._id)

   // Send HTTP-only cookie
   res.cookie('token', token, {
    path: '/',
    httpOnly: true,
    expires:  new Date(Date.now() + 1000 * 86400), // Expires in 1 day
    sameSite: 'none',
    secure: true,
   })
   
   if (user) {
    console.log('User Created!')
    const {id, name, photo, role} = user
    res.status(201).json({
        id, name, photo, role, token
    })
   } else {
    res.status(400)
    throw new Error('Invalid user data.')
   }
})

// Login User
const loginUser = asyncHandler(async (req,res) => {
    res.send('Login User')
})

module.exports = {
    registerUser,
    loginUser
}