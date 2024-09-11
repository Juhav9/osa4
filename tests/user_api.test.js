const {test, beforeEach, after, describe} = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const assert = require('node:assert')
const User = require('../models/user')


const api = supertest(app)

describe('testing username and password is valid', async => {
    beforeEach(async () => {
        const user = {
            name: "Tester",
            username: "tester",
            password: "password"
        }
        await User.deleteMany({})

        await api.post('/api/users').send(user)
    })
    test('username can not be too short', async () => {
        const invalidUsername = {
            name: "Tester",
            username: "xy",
            password: "password"
        }
        const errorMessage = 'User validation failed: username: Path `username` (`xy`) is shorter than the minimum allowed length (3).' 
        const response = await api.post('/api/users/').send(invalidUsername).expect(400)
        assert.strictEqual(response.body.error, errorMessage)
    })
    test('password can not be too short', async ()=> {
        const invalidPassword = {
            name: "Tester",
            username: "xyz",
            password: "pa"
        }
        const errorMessage = 'Password is too short'
        const response = await api.post('/api/users/').send(invalidPassword).expect(400)
        assert.strictEqual(response.body.error, errorMessage)
    })
    test('username must be unique', async () => {
        const notUniqueUser = {
            name: "Tester",
            username: "tester",
            password: "password"
        }
        const errorMessage = 'username must be unique'
        const response = await api.post('/api/users/').send(notUniqueUser).expect(400)
        assert.strictEqual(response.body.error, errorMessage)
    })
})

after(async()=>{
    await mongoose.connection.close()
})