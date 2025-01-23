const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const supertest = require('supertest')
const mongoose = require('mongoose')
const app = require('../app')
const api = supertest(app)

const helper = require('./api_test_helper')

const Blog = require('../models/blog')

beforeEach(async () => {
  await Blog.deleteMany({})

  const blogObjects = helper.initialBlogs
    .map(blog => new Blog(blog))
  const promiseArray = blogObjects.map(blog => blog.save())
  await Promise.all(promiseArray)
})

describe('api tests', () => {
  test('6 blogs are returned in JSON', async () => {
    const blogs = await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)

    assert.strictEqual(blogs.body.length, 6)
  })

  test('blog posts use "id" and not "_id"', async () => {
    const blogsAtStart = await helper.blogsInDb()

    assert.strictEqual(Object.keys(blogsAtStart[0])[4], 'id')
  })

  test.only('a valid note can be added', async () => {
    const newBlog = {
      title: 'test note',
      author: 'test author',
      url: 'https://example.com',
      likes: 25,
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    const titles = blogsAtEnd.map(b => b.title)

    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)

    assert(titles.includes('test note'))
  })
})

after (async () => {
  await mongoose.connection.close()
})


