import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Dialog, DialogTitle,  DialogContent, DialogActions, TextField, Button, Box, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import RichTextEditor from './RichTextEditor';

function AddPostModal({ open, mode = 'create', initialData, loading, onClose, onSubmit }: any) {
  const { register, handleSubmit, reset, setValue, watch, control, formState: { errors } } = useForm({
    defaultValues: { title: '', body: '', image: null as string | null },
  });
  const image = watch('image');
  const { t } = useTranslation();

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
    <Dialog open={open} onClose={onClose} fullWidth slotProps={{ paper: { sx: { borderRadius: '16px', p: 1 } } }}>
      <DialogTitle sx={{ fontWeight: 700 }}>{mode === 'edit' ? t('modal.editTitle') : t('modal.addTitle')}</DialogTitle>
      <DialogContent>
        <TextField
          label={t('modal.titleLabel')}
          {...register('title', { required: t('modal.titleRequired') })}
          error={!!errors.title}
          helperText={errors.title?.message as string}
          fullWidth
          margin="normal"
        />
        <Typography variant="body2" sx={{ color: errors.body ? 'error.main' : 'text.secondary', mt: 1 }}>
          {t('modal.bodyLabel')}
        </Typography>
        <Controller
          name="body"
          control={control}
          rules={{
            validate: (value: any) => value.replace(/<[^>]+>/g, '').trim() !== '' || t('modal.bodyRequired'),
          }}
          render={({ field }) => (
            <RichTextEditor value={field.value} onChange={field.onChange} />
          )}
        />
        {errors.body && (
          <Typography variant="caption" sx={{ color: 'error.main', display: 'block', mb: 1 }}>
            {errors.body.message as string}
          </Typography>
        )}
        <Button component="label" variant="outlined" sx={{ mt: 1 }}>
          {t('modal.choosePhoto')}
          <input type="file" accept="image/*" hidden onChange={handleImageChange} />
        </Button>
        {image && (
          <Box
            component="img"
            src={image}
            sx={{ display: 'block', maxWidth: 200, mt: 2, borderRadius: '12px', border: 1, borderColor: 'divider' }}
          />
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} disabled={loading}>{t('common.cancel')}</Button>
        <Button variant="contained" onClick={handleSubmit(onFormSubmit)} loading={loading}>
          {mode === 'edit' ? t('modal.save') : t('modal.add')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default AddPostModal;
