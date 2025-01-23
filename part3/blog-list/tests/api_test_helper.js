const Blog = require('../models/blog')
const biggerList = require('./biggerList')

const initialBlogs = biggerList

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

module.exports = {
  blogsInDb, initialBlogs
}
