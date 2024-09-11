const blogsRouter = require('express').Router()
const jwt = require('jsonwebtoken')
const Blog = require('../models/blog')
const User = require('../models/user')
const {userExtractor} = require('../utils/middleware')

const getToken = request => {
  const authorization = request.get('authorization')
  if(authorization&&authorization.startsWith('Bearer ')){
    return authorization.replace('Bearer ', '')
  }
  return null
}

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user',{username:1, name:1})
  response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
  const decodedToken = jwt.verify(request.token, process.env.SECRET)

  if(!decodedToken.id){
    return response.status(401).json({error: 'token invalid'})
  }
  const user = await User.findById(decodedToken.id)
  const blog = new Blog(request.body)
  if(blog.likes===undefined) {
    blog.likes=0
  }
  if(blog.title===undefined||blog.url===undefined) {
    response.status(400).end()
    return 
  }

  blog.user = user._id

  const result = await blog.save()
  user.blogs = user.blogs.concat(result._id)
  await user.save()

  response.status(201).json(result)
  })

blogsRouter.delete('/:id', userExtractor, async (request, response) => {
  //const decodedToken = jwt.verify(request.token, process.env.SECRET)
  const user = request.user 
  const blog = await Blog.findById(request.params.id)

  if(user._id.toString()===blog.user.toString()){
    await Blog.findByIdAndDelete(request.params.id)

    const updatedBlogs = user.blogs.filter(b => {
      if(b.toString()!==request.params.id){
        return b
      }
    })
    user.blogs = [...updatedBlogs]
    await User.findByIdAndUpdate(user._id.toString(), user) 
    return response.status(200).end()
  }

  response.status(401).json({error: 'invalid token'})
})

blogsRouter.put('/:id', userExtractor, async (request, response) => {
  const user = request.user 
  const blog = await Blog.findById(request.params.id)

  if(user._id.toString()===blog.user.toString()){
    blog.likes+=1
    const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, {new: true})
    return response.status(201).json(updatedBlog)
  }
  response.status(401).json({error: 'invalid token'})
})

module.exports = blogsRouter