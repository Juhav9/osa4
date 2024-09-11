const express = require('express')
const app = express()
const cors = require('cors')
require('express-async-errors')
const blogsRouter = require('./controller/blogs')
const userRouter = require('./controller/users')
const {tokenExtractor, errorHandler} = require('./utils/middleware')
const mongoose = require('mongoose')
const config = require('./utils/config')
const loginRouter = require('./controller/login')

mongoose.connect(config.MONGODB_URI)

app.use(cors())
app.use(express.json())


app.use('/api/login', loginRouter)
app.use('/api/users', userRouter)
app.use('/api/blogs', tokenExtractor,blogsRouter)

app.use(errorHandler)

module.exports = app