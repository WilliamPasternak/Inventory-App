const asyncHandler = require('express-async-handler')
const User = require('../models/User')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

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
    const {email , password } = req.body
    // Validate Request
    if (!email) {
        res.status(400)
        throw new Error('Please provide email.')
    }
    if (!password) {
        res.status(400)
        throw new Error('Please provide password.')
    }
    // Check if user exists.
    const user = await User.findOne({email})
    if (!user) {
        res.status(400)
        throw new Error('Email address not found. Please register or try a different email.')
    }

    // User exists, check if supplied password matches password in database
    const passwordIsCorrect = await bcrypt.compare(password, user.password)

    // Generate Token
   const token = generateToken(user._id)

   // Send HTTP-only cookie
   if(passwordIsCorrect){
    // Send HTTP-only cookie
   res.cookie("token", token, {
     path: "/",
     httpOnly: true,
     expires: new Date(Date.now() + 1000 * 86400), // 1 day
     sameSite: "none",
     secure: true,
   })
 }

    if (user && passwordIsCorrect) {
        const {id, name, photo, role} = user
        res.status(200).json({
            id, name, photo, role, token
        })
    } else {
        res.status(400)
        throw new Error('Invalid credentials.')
    }
})


module.exports = {
    registerUser,
    loginUser
}