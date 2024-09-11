const User = require('../models/user') 
const jwt = require('jsonwebtoken')

const errorHandler = (error, request, response, next) => {
    //console.log('error message: ',error.message)
    //console.log('error name: ', error.name)
    if(error.name==='ValidationError') {
        return response.status(400).json({error: error.message})
    }else if(error.name==='MongoServerError') {
        error.message = 'username must be unique'
        return response.status(400).json({error: error.message})
    }else if(error.name==='JsonWebTokenError'){
        return response.status(401).json({error: error.message})
    }else if(error.name==='TypeError'){
        return response.status(400).json({error: error.message})
    }else if (error.name==='CastError') {
        return response.status(400).json({error: error.message})
    }
    next(error)
}

const tokenExtractor = (request, response, next) => {
    const authorization = request.get('authorization')
    if(authorization&&authorization.startsWith('Bearer ')){
        request.token = authorization.replace('Bearer ', '')
      }
    next()
}

const userExtractor = async (request, response, next) => {
    const userFromToken = jwt.verify(request.token, process.env.SECRET)
    const user = await User.findById(userFromToken.id)
    request.user = user
    next()
}

module.exports = {
    errorHandler,
    tokenExtractor,
    userExtractor
}