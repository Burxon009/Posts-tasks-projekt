import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, IconButton, Skeleton, Dialog, DialogTitle, DialogActions, Snackbar, Pagination } from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import AddPostModal from './AddPostModal'
import {usePostsStore} from './postsStore'
import { useTranslation } from 'react-i18next'
const isLocalPost = (id: number) => id > 100;


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
    return <div>{t('common.loadError')}</div>;
  }

  return (
    <div>
      <Button startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)}>{t('common.back')}</Button>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '10px' }}>
        <h2>{t('posts.title')}</h2>
        <Button variant="contained" onClick={handleOpenAdd}>{t('posts.add')}</Button>
      </div>

      {isLoading ? (
        Array.from({ length: 5 }).map((_, i) => (
          <div key={i} style={{ border: '1px solid gray',  margin: '10px', padding: '10px' }}>
            <Skeleton variant="text" width="60%" height={32} />
            <Skeleton variant="text" width="100%" />
            <Skeleton variant="text" width="80%" />
          </div>
        ))
      ) : (
        posts.map((post: any) => (
          <div key={post.id} style={{ border: '1px solid gray', margin: '10px', padding: '10px' }}>
            {post.image && (
              <img src={post.image} style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
            )}
            <h3>{post.title}</h3>
            <p>{post.body.slice(0, 100)}...</p>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <button onClick={() => navigate(`/posts/${post.id}`)}>{t('posts.open')}</button>
              <IconButton onClick={() => handleOpenEdit(post)} size="small" aria-label={t('posts.edit')}>
                <EditIcon fontSize="small" sx={{ color: 'yellow' }} />
              </IconButton>
              <Button
                size="small"
                color="error"
                loading={deletingId === post.id}
                onClick={() => setConfirmDeleteId(post.id)}
              >
                {t('common.delete')}
              </Button>
            </div>
          </div>
        ))
      )}

      <Pagination
        count={10}
        page={page}
        onChange={(_e, value) => setPage(value)}
        style={{ margin: '10px',}}
          sx={{
    '& .MuiPaginationItem-root': {
      color: 'green',
    },
  }}
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
        <DialogTitle style={{ color: '#691e25' }}>{t('posts.confirmDelete')}</DialogTitle>
        <DialogActions>
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
    </div>
  );
}

export default PostsPage
