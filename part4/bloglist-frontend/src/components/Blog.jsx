import { useState } from 'react'

const Blog = ({ blog }) => {
  const [showDetails, setShowDetails] = useState(false)

  const toggleDetails = () => {
    setShowDetails(!showDetails)
  }
  
  const blogStyle = {
    padding: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
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
          <button>like</button>
        </div>
        <div>{blog.author}</div>
      </div>
    )
  }

  return (
    <div style={blogStyle}>
      <div>
        {blog.title} {''}
        {blog.author} {''}
        <button onClick={toggleDetails}>view</button>
      </div> 
    </div> 
  )
}

export default Blog