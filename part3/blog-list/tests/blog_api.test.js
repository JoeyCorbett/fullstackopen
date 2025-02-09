const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const supertest = require('supertest')
const mongoose = require('mongoose')
const app = require('../app')
const api = supertest(app)

const bcrypt = require('bcrypt')
const helper = require('./api_test_helper')

const Blog = require('../models/blog')
const User = require('../models/user')

let userJwt

beforeEach(async () => {
  await Blog.deleteMany({})

  const blogObjects = helper.initialBlogs
    .map(blog => new Blog(blog))
  const promiseArray = blogObjects.map(blog => blog.save())
  await Promise.all(promiseArray)

  const username = 'testUser'
  const password = 'testPass'

  const newUser = { username, password }
  await api
    .post('/api/users')
    .send(newUser)

  const res = await api
    .post('/api/login')
    .send({ username, password })

  userJwt = res.body.token
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

  test('a valid blog can be added', async () => {
    const newBlog = {
      title: 'test note',
      author: 'test author',
      url: 'https://example.com',
      likes: 0,
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${userJwt}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    const titles = blogsAtEnd.map(b => b.title)

    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)

    assert(titles.includes('test note'))
  })

  test.only('blog added w/out token fails with status code 401', async () => {
    const newBlog = {
      title: 'test note',
      author: 'test author',
      url: 'https://example.com',
      likes: 0,
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(401)
      .expect('Content-Type', /application\/json/)
  })

  test('blog added witout id defaults to 0', async () => {
    const newBlog = {
      title: 'test note',
      author: 'test author',
      url: 'https://example.com',
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${userJwt}`)
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
    .set('Authorization', `Bearer ${userJwt}`)
    .send(noTitle)
    .expect(400)
})

test('blog without url returns 400', async () => {
  const noUrl = {
    title: 'test title',
    author: 'test author',
    likes: 2,
  }

  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${userJwt}`)
    .send(noUrl)
    .expect(400)
})

describe('deletion of a blog', () => {
  test('succeeds with status code 204 if id is valid', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[0]

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set('Authorization', `Bearer ${userJwt}`)
      .expect(204)

    const blogsAtEnd = await helper.blogsInDb()

    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length - 1)

    const contents = blogsAtEnd.map(b => b.title)
    assert(!contents.includes(blogToDelete.title))
  })

  test('fails with status code 404 if id is not valid', async () => {
    const validNonexistingId = await helper.nonExistingId()

    await api
      .delete(`/api/blogs/${validNonexistingId}`)
      .set('Authorization', `Bearer ${userJwt}`)
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
      .set('Authorization', `Bearer ${userJwt}`)
      .send(updatedBlogBefore)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const updatedBlogAfter = await helper.findBlogInDb(updatedBlogBefore.id)
    assert.strictEqual(updatedBlogAfter.likes, 100)
  })

  test('fails with status code 404 is id is not valid', async () => {
    const validNonexistingId = await helper.nonExistingId()

    await api
      .put(`/api/blogs/${validNonexistingId}`)
      .expect(404)
  })
})

describe('when there is initially one user in db', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('secret', 10)
    const user = new User({ username: 'root', passwordHash })

    await user.save()
  })

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'jcorb',
      name: 'Joseph Corbett',
      password: 'jswizzle',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.username)
    assert(usernames.includes(newUser.username))
  })

  test('creation fails with proper statuscode and message if username already taken', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'root',
      name: 'Superuser',
      password: 'salainen',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    assert(result.body.error.includes('expected `username` to be unique'))

    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })
})

describe('username and password validation', () => {
  test('creation fails with proper statuscode and message if username is ommited', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      name: 'test_user',
      password: 'testpass'
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    assert(result.body.error.includes('username: Path `username` is required'))

    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })

  test('creation fails with proper statuscode and message if password is ommited', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'test_user',
      name: 'test_name'
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    assert(result.body.error.includes('missing password'))

    const usersAtEnd = await helper.usersInDb()

    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })

  test('creation fails with proper statuscode and message if username or password is less than 3 chars', async () => {
    const usersAtStart = await helper.usersInDb()

    const shortUser = {
      username: '12',
      name: 'test_name',
      password: 'password'
    }

    let result = await api
      .post('/api/users')
      .send(shortUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    assert(result.body.error.includes('Path `username` (`12`) is shorter than the minimum allowed length (3)'))

    const shortPass = {
      username: 'test_user',
      name: 'test_name',
      password: '12'
    }

    result = await api
      .post('/api/users')
      .send(shortPass)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    assert(result.body.error.includes('password must be atleast 3 characters'))

    const usersAtEnd = await helper.usersInDb()

    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })
})

after (async () => {
  await mongoose.connection.close()
})