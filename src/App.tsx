import { Routes, Route } from 'react-router-dom'
import HomePage from './HomePage'
import PostsPage from './PostsPage'
import PostPage from './PostPage'
import ChatPage from './ChatPage'
import BoardPage from './BoardPage'
import Sidebar from './Sidebar'
import { Box } from '@mui/material'

function App() {
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      <Box sx={{ flexGrow: 1, minWidth: 0 }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/posts" element={<PostsPage />} />
          <Route path="/posts/:id" element={<PostPage />} />
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/board" element={<BoardPage />} />
        </Routes>
      </Box>
    </Box>
  )
}

export default App