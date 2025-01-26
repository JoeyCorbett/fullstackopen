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

  test('a valid note can be added', async () => {
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

  test('blog added witout id defaults to 0', async () => {
    const newBlog = {
      title: 'test note',
      author: 'test author',
      url: 'https://example.com',
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    const likes = blogsAtEnd.map(b => b.likes)

    assert.strictEqual(likes[likes.length - 1], 0)

  })
})

test('blog without title returns 400', async () => {
  const noTitle = {
    author: 'test author',
    url: 'https://example.com',
    likes: 4,
  }

  await api
    .post('/api/blogs')
    .send(noTitle)
    .expect(400)
})

test.only('blog without url returns 400', async () => {
  const noUrl = {
    title: 'test title',
    author: 'test author',
    likes: 2,
  }

  await api
    .post('/api/blogs')
    .send(noUrl)
    .expect(400)
})

describe('deletion of a blog', () => {
  test('succeeds with status code 204 if id is valid', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[0]

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .expect(204)

    const blogsAtEnd = await helper.blogsInDb()

    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length - 1)

    const contents = blogsAtEnd.map(b => b.title)
    assert(!contents.includes(blogToDelete.title))
  })

  test('fails with stauts code 404 if id is not valid', async () => {
    const validNonexistingId = await helper.nonExistingId()

    await api
      .delete(`/api/blogs/${validNonexistingId}`)
      .expect(404)
  })
})

describe('updating a blog', () => {
  test('succeeds with status code 200 if id is valid', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToUpdate = blogsAtStart[0]

    const updatedBlogBefore = { ...blogToUpdate, likes: 100 }

    await api
      .put(`/api/blogs/${updatedBlogBefore.id}`)
      .send(updatedBlogBefore)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const updatedBlogAfter = await helper.findBlogInDb(updatedBlogBefore.id)
    assert.strictEqual(updatedBlogAfter.likes, 100)
  })

  test.only('fails with status code 404 is id is not valid', async () => {
    const validNonexistingId = await helper.nonExistingId()

    await api
      .put(`/api/blogs/${validNonexistingId}`)
      .expect(404)
  })
})

after (async () => {
  await mongoose.connection.close()
})