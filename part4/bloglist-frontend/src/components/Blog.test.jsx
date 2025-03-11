import { render, screen } from '@testing-library/react'
import Blog from './Blog'
import userEvent from '@testing-library/user-event'

test('<Blog /> renders title & author but not URL or Likes', async () => {
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

test('<Blog /> after clicking `view` button, URL & Likes are displayed', async () => {
  const blog = {
    title: 'test title',
    author: 'test author',
    url: 'https://testURL.com',
    like: 2,
    user: {
      id: '67a3c69ab66677d54b8d0721'
    }
  }

  const user = {
    id: '67a3c69ab66677d54b8d0721',
  }

  render(<Blog blog={blog} user={user} />)

  const userSesh = userEvent.setup()
  const button = screen.getByText('view')
  await userSesh.click(button)

  const url = screen.queryByText('https://textURL.com')
  const likes = screen.queryByText('2')

  expect(url).toBeDefined()
  expect(likes).toBeDefined
})
