const BlogForm = ({ handleNewBlog, handleChange, newBlog }) => (
  <form onSubmit={handleNewBlog}>
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

export default BlogForm