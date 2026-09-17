import { Routes, Route } from 'react-router-dom'
import PostsPage from './PostsPage'
import PostPage from './PostPage'

function App() {
  return (
    <Routes>
      <Route path="/posts" element={<PostsPage />} />
      <Route path="/posts/:id" element={<PostPage />} />
    </Routes>
  )
}

export default App