import { useEffect, useState } from 'react';
import { Dialog, DialogTitle,  DialogContent, DialogActions, TextField, Button } from '@mui/material';

function AddPostModal({ open, mode = 'create', initialData, loading, onClose, onSubmit }: any) {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');

  useEffect(() => {
    if (open) {
      setTitle(initialData?.title ?? '');
      setBody(initialData?.body ?? '');
    }
  }, [open, initialData]);

  const handleSubmit = () => {
    if (!title || !body) return;
    onSubmit({ title, body });
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>{mode === 'edit' ? 'Редактировать пост' : 'Добавить пост'}</DialogTitle>
      <DialogContent>
        <TextField
          label="Заголовок"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Текст поста"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          fullWidth
          multiline
          rows={4}
          margin="normal"
        />
      </DialogContent>
      
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>Отмена</Button>
        <Button variant="contained" onClick={handleSubmit} loading={loading}>
          {mode === 'edit' ? 'Сохранить' : 'Добавить'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default AddPostModal;
