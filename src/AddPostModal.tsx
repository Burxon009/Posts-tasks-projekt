import { useEffect, useState } from 'react';
import { Dialog, DialogTitle,  DialogContent, DialogActions, TextField, Button } from '@mui/material';

function AddPostModal({ open, mode = 'create', initialData, loading, onClose, onSubmit }: any) {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [image, setImage] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setTitle(initialData?.title ?? '');
      setBody(initialData?.body ?? '');
      setImage(initialData?.image ?? null);
    }
  }, [open, initialData]);

  const handleImageChange = (e: any) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = () => {
    if (!title || !body) return;
    onSubmit({ title, body, image });
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
        <Button component="label" variant="outlined" style={{ marginTop: '10px' }}>
          Выбрать фото
          <input type="file" accept="image/*" hidden onChange={handleImageChange} />
        </Button>
        {image && (
          <div>
            <img src={image} style={{ maxWidth: '200px', marginTop: '10px' }} />
          </div>
        )}
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
