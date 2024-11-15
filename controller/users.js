const userRouter = require('express').Router()
const bcrypt = require('bcrypt')
const User = require('../models/user') 

userRouter.post('/', async (request, response) => {
    const {username, name, password} = request.body

    if(!(password)){
        return response.status(400).json({error: "Missing password"})
    }
    if((password.length<3)) {
        return response.status(400).json({error: "Password is too short"})
    }
    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)

    const user = new User({
        username,
        name, 
        passwordHash
    })
    const savedUser = await user.save()

    response.status(201).json(savedUser)
})

userRouter.get('/', async (request, response) =>{
    const users  = await User.find({}).populate('blogs',{url:1, title:1, author:1})
    response.status(200).json(users)
})

module.exports = userRouter