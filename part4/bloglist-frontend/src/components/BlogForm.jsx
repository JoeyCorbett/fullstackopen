import { useState } from 'react'

const BlogForm = ({ createBlog, notifyWith }) => {
  const [newBlog, setNewBlog] = useState({
    title: '',
    author: '',
    url: '',
  })

  const addBlog = async (event) => {
    event.preventDefault()
    await createBlog(newBlog)

    setNewBlog({
      title: '',
      author: '',
      url: '',
    })
    notifyWith(`A New Blog: ${newBlog.title} by ${newBlog.author} added`)
  }

  const handleChange = (e) => {
    setNewBlog({
      ...newBlog,
      [e.target.name]: e.target.value,
    })
  }

  return (
    <form onSubmit={addBlog}>
      <div>
        title:
        <input 
          type="text"
          value={newBlog.title}
          name='title'
          onChange={handleChange}
        />
      </div>
      <div>
        author:
        <input 
          type="author"
          value={newBlog.author}
          name='author'
          onChange={handleChange}
        />
      </div>
      <div>
        url:
        <input 
          type="text"
          value={newBlog.url}
          name='url'
          onChange={handleChange}
        />
      </div>
      <button type="submit">create</button>
    </form>
  )
}

export default BlogForm