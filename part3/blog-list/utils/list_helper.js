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


module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
}