const dummy = () => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.reduce((sum, blog) => sum + blog.likes, 0)
}


const favoriteBlog = (blogs) => {
  if (blogs.length === 0) return null

  const maxObj = blogs.reduce(
    (max, blog) => blog.likes > max.likes ? blog : max, blogs[0]
  )
  const { _id, __v, ...result } = maxObj
  return result
}

const mostBlogs = (blogs) => {
  if (blogs.length === 0) return null

  const authors = {}
  blogs.forEach(blog => {
    if (!authors[blog.author]) {
      authors[blog.author] = 0
    }
    authors[blog.author] += 1
  })

  const maxObj = Object.entries(authors).reduce(
    (max, [author, blogs]) => {
      return blogs > max.blogs ? { author, blogs } : max
    },
    { author: null, blogs: 0 })
  return maxObj
}

const mostLikes = (blogs) => {
  if (blogs.length === 0) return null

  const authors = {}
  blogs.forEach(blog => {
    if (!authors[blog.author]) {
      authors[blog.author] = 0
    }
    authors[blog.author] += blog.likes
  })

  const maxObj = Object.entries(authors).reduce(
    (max, [author, likes]) => {
      return likes > max.likes ? { author, likes } : max
    },
    { author: null, likes: 0 }
  )
  return maxObj
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
}