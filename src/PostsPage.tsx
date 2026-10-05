import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, IconButton, Skeleton, Dialog, DialogTitle, DialogActions, Snackbar, Pagination, Box, Card, CardContent, CardActions, CardMedia, Typography, Stack } from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import AddPostModal from './AddPostModal'
import {usePostsStore} from './postsStore'
import { useTranslation } from 'react-i18next'
import DOMPurify from 'dompurify'
const isLocalPost = (id: number) => id >= 1;

function PostsPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const setStorePosts = usePostsStore((state) => state.setPosts)
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  const [open, setOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<any>(null);
  const [addingPost, setAddingPost] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarText, setSnackbarText] = useState('');
  const [page, setPage] = useState(1);
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:3001');
    wsRef.current = ws;

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'post') {
        setPosts((old) => [data.post, ...old]);
        setStorePosts([data.post, ...usePostsStore.getState().posts]);
        setSnackbarText(i18n.t('posts.newPost', { title: data.post.title }));
        setSnackbarOpen(true);
      }
    };

    return () => {
      ws.close();
    };
  }, []);

useEffect(() => {
  setIsLoading(true);
  setIsError(false);

  fetch(`https://jsonplaceholder.typicode.com/posts?_page=${page}&_limit=10`)
    .then((response) => response.json())
    .then((data) => {
      const localPosts = usePostsStore.getState().posts.filter((p) => isLocalPost(p.id));
      const deletedIds = usePostsStore.getState().deletedIds;
      const merged = [...localPosts, ...data].filter((p) => !deletedIds.includes(p.id));
      setPosts(merged);
      setStorePosts(merged);
      setIsLoading(false);
    })
    .catch(() => {
      setIsError(true);
      setIsLoading(false);
    });
}, [page]);

  const handleOpenAdd = () => {
    setEditingPost(null);
    setOpen(true);
  };

  const handleOpenEdit = (post: any) => {
    setEditingPost(post);
    setOpen(true);
  };

  const handleCloseModal = () => {
    setOpen(false);
    setEditingPost(null);
  };

  const handleSubmit = (post: any) => {
    if (editingPost) {
      const updatedPost = { ...editingPost, ...post };

if (isLocalPost(updatedPost.id)) {
  setPosts((old) => old.map((p) => (p.id === updatedPost.id ? updatedPost : p)));
  setStorePosts(
    usePostsStore.getState().posts.map((p) => (p.id === updatedPost.id ? updatedPost : p))
  );
  setOpen(false);
  setEditingPost(null);
  setSnackbarText(t('posts.saved'));
  setSnackbarOpen(true);
  return;
}

      setEditingId(updatedPost.id);
      fetch(`https://jsonplaceholder.typicode.com/posts/${updatedPost.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedPost),
      })
        .then((response) => response.json())
        .then((result) => {
          setPosts((old) => old.map((p) => (p.id === result.id ? result : p)));
          setStorePosts(
            usePostsStore.getState().posts.map((p) => (p.id === result.id ? result : p))
          );
          setOpen(false);
          setEditingPost(null);
          setSnackbarText(t('posts.savedEmoji'));
          setSnackbarOpen(true);
        })
        .finally(() => setEditingId(null));
    } else {
      setAddingPost(true);
      fetch('https://jsonplaceholder.typicode.com/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(post),
      })
        .then((response) => response.json())
        .then(() => {
          const postWithId = { ...post, id: Date.now() };
          setPosts((old) => [postWithId, ...old]);
          setStorePosts([postWithId, ...usePostsStore.getState().posts]);
          wsRef.current?.send(JSON.stringify({ type: 'post', post: postWithId }));
          setOpen(false);
        })
        .finally(() => setAddingPost(false));
    }
  };

  const handleConfirmDelete = () => {
    if (confirmDeleteId === null) return;

    const id = confirmDeleteId;
    setConfirmDeleteId(null);

    if (isLocalPost(id)) {
      setPosts((old) => old.filter((p) => p.id !== id));
      setStorePosts(usePostsStore.getState().posts.filter((p) => p.id !== id));
      usePostsStore.getState().addDeletedId(id);
      return;
    }

    setDeletingId(id);
    fetch(`https://jsonplaceholder.typicode.com/posts/${id}`, {
      method: 'DELETE',
    })
      .then(() => {
        setPosts((old) => old.filter((p) => p.id !== id));
        setStorePosts(usePostsStore.getState().posts.filter((p) => p.id !== id));
        usePostsStore.getState().addDeletedId(id);
      })
      .finally(() => setDeletingId(null));
  };

  if (isError) {
    return <Box sx={{ p: 4 }}><Typography sx={{ color: 'error.main' }}>{t('common.loadError')}</Typography></Box>;
  }

  return (
    <Box sx={{ p: 4 }}>
      <Button startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)} sx={{ mb: 2 }}>{t('common.back')}</Button>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">{t('posts.title')}</Typography>
        <Button variant="contained" onClick={handleOpenAdd}>{t('posts.add')}</Button>
      </Box>

      <Stack spacing={2}>
        {isLoading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <Card key={i} elevation={2}>
              <CardContent>
                <Skeleton variant="text" width="60%" height={32} />
                <Skeleton variant="text" width="100%" />
                <Skeleton variant="text" width="80%" />
              </CardContent>
            </Card>
          ))
        ) : (
          posts.map((post: any) => (
            <Card
              key={post.id}
              elevation={2}
              sx={{ transition: 'transform 0.2s, box-shadow 0.2s', '&:hover': { transform: 'translateY(-3px)', boxShadow: 6 } }}
            >
              {post.image && (
                <CardMedia component="img" image={post.image} sx={{ height: 200, objectFit: 'cover' }} />
              )}
              <CardContent>
                <Typography variant="h6" sx={{ mb: 1 }}>{post.title}</Typography>
                <Typography
                  component="div"
                  sx={{
                    color: 'text.secondary',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    '& p': { margin: 0 },
                  }}
                  dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(post.body) }}
                />
              </CardContent>
              <CardActions sx={{ px: 2, pb: 2 }}>
                <Button size="small" variant="outlined" onClick={() => navigate(`/posts/${post.id}`)}>{t('posts.open')}</Button>
                <IconButton onClick={() => handleOpenEdit(post)} size="small" aria-label={t('posts.edit')} title={t('posts.edit')}>
                  <EditIcon fontSize="small" color="primary" />
                </IconButton>
                <Button
                  size="small"
                  color="error"
                  loading={deletingId === post.id}
                  onClick={() => setConfirmDeleteId(post.id)}
                  sx={{ ml: 'auto' }}
                >
                  {t('common.delete')}
                </Button>
              </CardActions>
            </Card>
          ))
        )}
      </Stack>

      <Pagination
        count={10}
        page={page}
        onChange={(_e, value) => setPage(value)}
        color="primary"
        sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}
      />

      <AddPostModal
        open={open}
        mode={editingPost ? 'edit' : 'create'}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        initialData={editingPost}
        loading={addingPost || editingId !== null}
      />

      <Dialog open={confirmDeleteId !== null} onClose={() => setConfirmDeleteId(null)}>
        <DialogTitle>{t('posts.confirmDelete')}</DialogTitle>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setConfirmDeleteId(null)}>{t('common.cancel')}</Button>
          <Button color="error" variant="contained" onClick={handleConfirmDelete}>{t('common.delete')}</Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={2000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarText}
      />
    </Box>
  );
}

export default PostsPage
