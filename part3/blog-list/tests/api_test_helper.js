const Blog = require('../models/blog')
const User = require('../models/user')
const biggerList = require('./biggerList')

const nonExistingId = async () => {
  const blog = new Blog({
    title: 'test title',
    author: 'test author',
    url: 'https://example.com',
    likes: 10,
  })
  await blog.save()
  await blog.deleteOne()

  return blog._id.toString()
}

const initialBlogs = biggerList

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

const findBlogInDb = async (id) => {
  const blog = await Blog.findById(id)
  return blog.toJSON()
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(u => u.toJSON())
}

module.exports = {
  blogsInDb,
  initialBlogs,
  nonExistingId,
  findBlogInDb,
  usersInDb
}
