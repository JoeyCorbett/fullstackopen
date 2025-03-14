import { useState } from 'react'
import blogService from '../services/blogs'
import propTypes from 'prop-types'

const Blog = ({ blog, updateBlog, user, handleDelete }) => {
  const [showDetails, setShowDetails] = useState(false)

  const toggleDetails = () => {
    setShowDetails(!showDetails)
  }

  const handleLike = async () => {
    const updatedBlog = {
      ...blog,
      likes: blog.likes + 1,
      user: blog.user.id,
    }

    try {
      const response = await blogService.update(blog.id, updatedBlog)
      updateBlog(blog.id, response)
    } catch (error) {
      console.log('Error liking blog', error)
    }
  }

  const blogStyle = {
    padding: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  }

  if (showDetails === true) {
    return (
      <div style={blogStyle}>
        <div>
          {blog.title} {''}
          <button onClick={toggleDetails}>hide</button>
        </div>
        <div>{blog.url}</div>
        <div>
          likes: {blog.likes} {''}
          <button onClick={handleLike}>like</button>
        </div>
        <div>{blog.author}</div>
        {user.id === blog.user.id && (
          <button onClick={() => handleDelete(blog)}>remove</button>
        )}
      </div>
    )
  }

  return (
    <div style={blogStyle}>
      <div className='blog'>
        <span>{blog.title} </span>
        <span>{blog.author}</span>
        <button onClick={toggleDetails}>view</button>
      </div>
    </div>
  )
}

Blog.propTypes = {
  blog: propTypes.object.isRequired,
  updateBlog: propTypes.func.isRequired,
  user: propTypes.object.isRequired,
  handleDelete: propTypes.func.isRequired
}

export default Blog
