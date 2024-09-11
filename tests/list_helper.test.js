const {test, describe} = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')
const {blogs} = require('../utils/blogsArr')

test('dummy return one', () => {
    const emptyList = []

    const result = listHelper.dummy(emptyList)
    assert.strictEqual(result, 1)
})

describe('total likes', () => {
      const emptyList = []
      const listWithOneBlog = [
        {
          _id: '5a422aa71b54a676234d17f8',
          title: 'Go To Statement Considered Harmful',
          author: 'Edsger W. Dijkstra',
          url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
          likes: 5,
          __v: 0
        }
      ]

    test('of total likes is zero', () => {
        const result = listHelper.totalLikes(emptyList)
        assert.strictEqual(result, 0)
    })  

    test('when list has only one blog equals the likes of that', () => {
        const result = listHelper.totalLikes(listWithOneBlog)
        assert.strictEqual(result, 5)
    })

    test('of a bigger list is calculated right', () => {
        const result = listHelper.totalLikes(blogs)
        assert.strictEqual(result, 36)
    })
})

describe('most liked blog', () => {
    const blog = {
            title: "Canonical string reduction",
            author: "Edsger W. Dijkstra",
            likes: 12
        }
    test('test most liked blog', () => {
        const result = listHelper.mostLikedBlog(blogs)

        const resultClone = {...result}
        delete resultClone.__v
        delete resultClone._id
        delete resultClone.url

        assert.deepStrictEqual(resultClone, blog)
    })
})

describe('most blogs', () => {
    const mostBlogs = {
            author: "Robert C. Martin",
            blogs: 3
    }
    test(' most blogged author', () => {
        const result = listHelper.mostBlogs(blogs)
        assert.deepStrictEqual(result, mostBlogs)
    })
})

describe('most likes', () => {
        const likedAuthor = {
            author: "Edsger W. Dijkstra",
            likes: 17
          }
        test('most liked author', () => {
        const result = listHelper.mostLikes(blogs)
        assert.deepStrictEqual(result, likedAuthor)       
    })
})