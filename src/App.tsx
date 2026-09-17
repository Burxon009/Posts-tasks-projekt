import { Routes, Route } from 'react-router-dom'
import HomePage from './HomePage'
import PostsPage from './PostsPage'
import PostPage from './PostPage'
import ChatPage from './ChatPage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/posts" element={<PostsPage />} />
      <Route path="/posts/:id" element={<PostPage />} />
      <Route path="/chat" element={<ChatPage />} />
    </Routes>
  )
}

export default App