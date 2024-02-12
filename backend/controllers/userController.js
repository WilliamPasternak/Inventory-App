const asyncHandler = require('express-async-handler')
const User = require('../models/User')


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
       name, email, password
   });
   // name, email, photo, role
   if (user) {
    console.log('User Created!')
    const {id, name, photo, role} = user
    res.status(201).json({
        id, name, photo, role
    })
   } else {
    res.status(400)
    throw new Error('Invalid user data.')
   }
})

module.exports = {
    registerUser
}