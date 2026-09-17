import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { Button, IconButton, Skeleton, Dialog, DialogTitle, DialogActions } from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import AddPostModal from './AddPostModal'

const isLocalPost = (id: number) => id > 100;

function PostsPage() {
  const [open, setOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<any>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);

  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data, isPending, isError, isFetching } = useQuery({
    queryKey: ['posts'],
    queryFn: async () => {
      const response = await fetch('https://jsonplaceholder.typicode.com/posts');
      return response.json();
    },
    staleTime: Infinity,
  });

  const addPostMutation = useMutation({
    mutationFn: async (newPost: any) => {
      const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPost),
      });
      return response.json();
    },
    onSuccess: (_result, newPost) => {
      const postWithId = { ...newPost, id: Date.now() };
      queryClient.setQueryData(['posts'], (old: any) => [postWithId, ...old]);
      setOpen(false);
    },
  });

  const editPostMutation = useMutation({
    mutationFn: async (post: any) => {
      if (isLocalPost(post.id)) {
        return post;
      }
      const response = await fetch(`https://jsonplaceholder.typicode.com/posts/${post.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(post),
      });
      return response.json();
    },
    onSuccess: (_result, updatedPost) => {
      queryClient.setQueryData(['posts'], (old: any) =>
        old.map((p: any) => (p.id === updatedPost.id ? updatedPost : p))
      );
      setOpen(false);
      setEditingPost(null);
    },
  });

  const deletePostMutation = useMutation({
    mutationFn: async (id: number) => {
      if (isLocalPost(id)) {
        return id;
      }
      const response = await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`, {
        method: 'DELETE',
      });
      return response.json();
    },
    onMutate: (id) => setDeletingId(id),
    onSuccess: (_result, id) => {
      queryClient.setQueryData(['posts'], (old: any) => old.filter((p: any) => p.id !== id));
    },
    onSettled: () => setDeletingId(null),
  });

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
      editPostMutation.mutate({ ...editingPost, ...post });
    } else {
      addPostMutation.mutate(post);
    }
  };

  const handleConfirmDelete = () => {
    if (confirmDeleteId !== null) {
      deletePostMutation.mutate(confirmDeleteId);
      setConfirmDeleteId(null);
    }
  };

  if (isError) {
    return <div>Ошибка загрузки</div>;
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '10px' }}>
        <h2>Посты</h2>
        <Button variant="contained" onClick={handleOpenAdd}>Добавить пост</Button>
      </div>

      {isFetching && !isPending && <p>Обновление данных...</p>}

      {isPending ? (
        Array.from({ length: 5 }).map((_, i) => (
          <div key={i} style={{ border: '1px solid gray',  margin: '10px', padding: '10px' }}>
            <Skeleton variant="text" width="60%" height={32} />
            <Skeleton variant="text" width="100%" />
            <Skeleton variant="text" width="80%" />
          </div>
        ))
      ) : (
        data.map((post: any) => (
          <div key={post.id} style={{ border: '1px solid gray', margin: '10px', padding: '10px' }}>
            <h3>{post.title}</h3>
            <p>{post.body.slice(0, 100)}...</p>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <button onClick={() => navigate(`/posts/${post.id}`)}>Открыть пост</button>
              <IconButton onClick={() => handleOpenEdit(post)} size="small" aria-label="Редактировать">
                <EditIcon fontSize="small" sx={{ color: 'yellow' }} />
              </IconButton>
              <Button
                size="small"
                color="error"
                loading={deletingId === post.id}
                onClick={() => setConfirmDeleteId(post.id)}
              >
                Удалить
              </Button>
            </div>
          </div>
        ))
      )}

      <AddPostModal
        open={open}
        mode={editingPost ? 'edit' : 'create'}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        initialData={editingPost}
        loading={addPostMutation.isPending || editPostMutation.isPending}
      />

      <Dialog open={confirmDeleteId !== null} onClose={() => setConfirmDeleteId(null)}>
        <DialogTitle style={{ color: '#691e25' }}>Вы действительно хотите удалить этот пост?</DialogTitle>
        <DialogActions>
          <Button onClick={() => setConfirmDeleteId(null)}>Отмена</Button>
          <Button color="error" variant="contained" onClick={handleConfirmDelete}>Удалить</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default PostsPage
