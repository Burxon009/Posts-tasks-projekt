import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Dialog, DialogTitle,  DialogContent, DialogActions, TextField, Button } from '@mui/material';

function AddPostModal({ open, mode = 'create', initialData, loading, onClose, onSubmit }: any) {
  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm({
    defaultValues: { title: '', body: '', image: null as string | null },
  });
  const image = watch('image');

  useEffect(() => {
    if (open) {
      reset({ title: initialData?.title ?? '', body: initialData?.body ?? '' });
      setValue('image', initialData?.image ?? null);
    }
  }, [open, initialData]);

  const handleImageChange = (e: any) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setValue('image', reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const onFormSubmit = (data: any) => {
    onSubmit({ ...data, image });
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>{mode === 'edit' ? 'Редактировать пост' : 'Добавить пост'}</DialogTitle>
      <DialogContent>
        <TextField
          label="Заголовок"
          {...register('title', { required: 'Заголовок обязателен' })}
          error={!!errors.title}
          helperText={errors.title?.message as string}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Текст поста"
          {...register('body', { required: 'Текст поста обязателен' })}
          error={!!errors.body}
          helperText={errors.body?.message as string}
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
        <Button variant="contained" onClick={handleSubmit(onFormSubmit)} loading={loading}>
          {mode === 'edit' ? 'Сохранить' : 'Добавить'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default AddPostModal;
