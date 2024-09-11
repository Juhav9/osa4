const {test, beforeEach, after, describe} = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const User = require('../models/user')
const assert = require('node:assert')

const {blogs} = require('../utils/blogsArr') 
const user = require('../models/user')

const api = supertest(app)

const getTokenForTest = async () => {
    const credentials = { username: 'tester2',
                          password: 'password'}

    const res = await api.post('/api/login').send(credentials)
    const bearer = 'Bearer '
    const token = bearer.concat(res.body.token)

    return token
}

describe('Test get endpoint', async() => {
    beforeEach(async ()=>{
        await Blog.deleteMany({})
        await User.deleteMany({})
        
        const user = {
            name: "Tester2",
            username: "tester2",
            password: "password"
        }
        const res = await api.post('/api/users').send(user)

        let blogObj = new Blog(blogs[0])
        blogObj.user = res.body._id
        await blogObj.save()
    
        blogObj = new Blog(blogs[1])
        blogObj.user = res.body._id
        await blogObj.save()
    })
    test('notes are returned as Json and right quantity', async () => {
        const response = await api.get('/api/blogs/').expect('Content-Type', /application\/json/)
        assert.strictEqual(response.body.length, 2)
    })
    test('id is correct format', async () => {
        const response = await api.get('/api/blogs/')
        assert(response.body[0].hasOwnProperty('id'))
    })
})

describe('Test post endpoint', async ()=> {
    beforeEach(async ()=>{
        await Blog.deleteMany({})
        await User.deleteMany({})
        
        const user = {
            name: "Tester2",
            username: "tester2",
            password: "password"
        }
        const res = await api.post('/api/users').send(user)
    
        let blogObj = new Blog(blogs[0])
        blogObj.user = res.body._id
        await blogObj.save()
    
        blogObj = new Blog(blogs[1])
        blogObj.user = res.body._id
        await blogObj.save()
    })

    test('after post there are right quantity blogs', async () => {
        const token = await getTokenForTest()

        const response = await api.post('/api/blogs').send(blogs[2]).set('Authorization', token).expect(201)
    
        const getResult = await api.get('/api/blogs')
        assert.strictEqual(getResult.body.length, 3)
    
        assert(getResult.body.some(b=>b.id===response.body.id))
    })

    test('missing likes-field have value zero', async ()=> {
        const objWithoutLikes = {
            title: "TDD harms architecture",
            author: "Robert C. Martin",
            url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
        }
        const token = await getTokenForTest()

        const users = await api.get('/api/users')
        objWithoutLikes.user = users.body[0]._id
        const response = await api.post('/api/blogs/').send(objWithoutLikes).set('Authorization', token).expect(201)
        assert.strictEqual(response.body.likes, 0)
    })

    test('400 is returned if title is missing', async ()=> {
        const objWithoutTitle = {
            author: "Robert C. Martin",
            url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
            likes: 0
        }
        const token = await getTokenForTest()

        const users = await api.get('/api/users')
        objWithoutTitle.user = users.body[0]._id

        await api.post('/api/blogs/').send(objWithoutTitle).set('Authorization', token).expect(400)
    })
    
    test('400 is returned if url is missing', async ()=> {
        const objWithoutUrl = {
            title: "TDD harms architecture",
            author: "Robert C. Martin",
            likes: 0
        }

        const token = await getTokenForTest()

        const users = await api.get('/api/users')
        objWithoutUrl.user = users.body[0]._id


        await api.post('/api/blogs/').send(objWithoutUrl).set('Authorization', token).expect(400)
    })
})


describe('test delete and update endpoint', async ()=> {
    beforeEach(async ()=>{
        await Blog.deleteMany({})
        await User.deleteMany({})
        
        const user = {
            name: "Tester2",
            username: "tester2",
            password: "password"
        }
        await api.post('/api/users').send(user)
        
        const token = await getTokenForTest()
        await api.post('/api/blogs').send(blogs[0]).set('Authorization', token)
        await api.post('/api/blogs').send(blogs[1]).set('Authorization', token)
    })

    test('delete by id working correctly', async () => {
        const token = await getTokenForTest()

        const res = await api.get('/api/users')
        const blog = res.body[0].blogs[0]
        const bodyLength = res.body[0].blogs.length

        await api.delete(`/api/blogs/${blog.id}`).set('Authorization', token).expect(200)

        const response = await api.get('/api/users')
        assert.strictEqual(response.body[0].blogs.length, bodyLength-1)
    })
    
    test('update likes-field by id working correctly', async () => {
        const token = await getTokenForTest()

        const res = await api.get('/api/blogs')
        const response = await api.put(`/api/blogs/${res.body[0].id}`).set('Authorization', token)
        assert.strictEqual(response.body.likes, res.body[0].likes+1)
    })
})
describe('invalid token', async () => {
    beforeEach(async ()=>{
        await Blog.deleteMany({})
        await User.deleteMany({})
        
        const user = {
            name: "Tester2",
            username: "tester2",
            password: "password"
        }
        const res = await api.post('/api/users').send(user)
    })
    test('if token is invalid right status code is returned', async () => {
        let invalidToken = await getTokenForTest()
        invalidToken = invalidToken.substring(0, invalidToken.length-6)

        await api.post('/api/blogs/').send(blogs[2]).set('Authorization', invalidToken).expect(401)

    })
})
after(async()=>{
    await mongoose.connection.close()
})
