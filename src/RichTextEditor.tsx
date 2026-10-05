import { useEffect } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import { TableKit } from '@tiptap/extension-table'
import { Box, IconButton } from '@mui/material'
import FormatBoldIcon from '@mui/icons-material/FormatBold'
import FormatItalicIcon from '@mui/icons-material/FormatItalic'
import { useTranslation } from 'react-i18next'

function RichTextEditor({ value, onChange }: any) {
  const { t } = useTranslation()
  const editor = useEditor({
    extensions: [StarterKit, Image, TableKit],
    content: value,
    shouldRerenderOnTransaction: true,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
  })

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value)
    }
  }, [value])

  if (!editor) return null

  return (
    <Box sx={{ mt: 2, mb: 1 }}>
      <Box sx={{ mb: 1 }}>
        <IconButton
          type="button"
          size="small"
          title={t('editor.bold')}
          aria-label={t('editor.bold')}
          color={editor.isActive('bold') ? 'primary' : 'default'}
          sx={{ bgcolor: editor.isActive('bold') ? 'action.selected' : 'transparent' }}
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          <FormatBoldIcon />
        </IconButton>
        <IconButton
          type="button"
          size="small"
          title={t('editor.italic')}
          aria-label={t('editor.italic')}
          color={editor.isActive('italic') ? 'primary' : 'default'}
          sx={{ bgcolor: editor.isActive('italic') ? 'action.selected' : 'transparent' }}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          <FormatItalicIcon />
        </IconButton>
        <IconButton
  type="button"
  size="small"
  onClick={() =>
    editor.chain().focus().insertTable({
      rows: 3,
      cols: 3,
      withHeaderRow: true,
    }).run()
  }
>
  Table
</IconButton>
        <IconButton
          type="button"
          size="small"
          onClick={() => {
            const url = window.prompt('Введите адрес ссылки')

            if (url) {
              editor.chain().focus().setLink({ href: url }).run()
            }
          }}
        >
          Link
        </IconButton>
      </Box>
      <Box
        sx={{
          border: 1,
          borderColor: 'divider',
          borderRadius: 1,
          p: 1.5,
          color: 'text.primary',
          '&:focus-within': { borderColor: 'primary.main' },
          '& .tiptap': { minHeight: 120, outline: 'none' },
          '& .tiptap p': { margin: 0 },
          '& .tiptap table': {
  borderCollapse: 'collapse',
  width: '100%',
},

'& .tiptap th, & .tiptap td': {
  border: '1px solid',
  borderColor: 'divider',
  padding: '8px',
},
        }}
      >
        <EditorContent editor={editor} />
      </Box>
    </Box>
  )
}

export default RichTextEditor
