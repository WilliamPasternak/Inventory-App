const dotenv = require("dotenv").config()
const express = require("express")
const mongoose = require("mongoose")
const bodyParser = require("body-parser")
const cors = require("cors")
const cookieParser = require("cookie-parser")


const userRoutes = require('./backend/routes/userRoute') 
const errorHandler = require('./backend/middleWare/errorMiddleware')

const app = express()

// Middleware
app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({extended: false}))
app.use(bodyParser.json())

// Routes Middleware
app.use('/api/users', userRoutes)


// Routes
app.get('/', (req,res) => {
  res.send('Home Page sent!')
})

// Error Middleware
app.use(errorHandler)

// Connect to DB and start server
  const PORT = process.env.PORT || 9000;
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server Running on port ${PORT}`);
    });
  })
  .catch((err) => console.log(err));


  