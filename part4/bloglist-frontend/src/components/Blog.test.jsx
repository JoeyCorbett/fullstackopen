import { render, screen } from '@testing-library/react'
import Blog from './Blog'

test('renders title & author but not URL or Likes', async () => {
  const blog = {
    title: 'test title',
    author: 'test author',
    url: 'https://testURL.com',
    likes: 2,
  }

  render(<Blog blog={blog} />)

  const title = screen.getByText('test title')
  const author = screen.getByText('test author')
  const url = screen.queryByText('https://testURL.com')
  const likes = screen.queryByText('2')

  expect(title).toBeDefined()
  expect(author).toBeDefined()
  expect(url).toBeNull()
  expect(likes).toBeNull()
})
