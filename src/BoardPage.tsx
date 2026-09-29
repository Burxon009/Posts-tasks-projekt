import { useEffect} from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { usePostsStore } from './postsStore';
import { useNavigate } from 'react-router-dom';
import { Button, Box, Paper, Typography, Card, CardContent, CardMedia, Chip } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useTranslation } from 'react-i18next';

function BoardPage() {
  const storePosts = usePostsStore((state) => state.posts);
  const navigate = useNavigate();
  const { t } = useTranslation();
  const deletedIds = usePostsStore((state) => state.deletedIds);
  const boards = usePostsStore((state) => state.boards);
  const setBoards = usePostsStore((state) => state.setBoards);

  useEffect(() => {
    const saved = usePostsStore.getState().boards;

    if (!saved) {
      setBoards({ new: storePosts, favorite: [], archive: [] });
      return;
    }

    const clean = (list: any[]) =>
      list
        .filter((p) => !deletedIds.includes(p.id))
        .map((p) => storePosts.find((s) => s.id === p.id) || p);

    const allIds = [...saved.new, ...saved.favorite, ...saved.archive].map((p: any) => p.id);
    const newPosts = storePosts.filter((p) => !allIds.includes(p.id));

    setBoards({
      new: [...newPosts, ...clean(saved.new)],
      favorite: clean(saved.favorite),
      archive: clean(saved.archive),
    });
  }, [storePosts, deletedIds]);

  const onDragEnd = (result: any) => {
    const { source, destination } = result;
    if (!destination) return;

    const sourceBoard = [...boards[source.droppableId]];
    const destBoard = source.droppableId === destination.droppableId
      ? sourceBoard
      : [...boards[destination.droppableId]];

    const [movedPost] = sourceBoard.splice(source.index, 1);
    destBoard.splice(destination.index, 0, movedPost);

    setBoards({
      ...boards,
      [source.droppableId]: sourceBoard,
      [destination.droppableId]: destBoard,
    });
  };
  if (!boards) return null;
  return (
    <Box sx={{ p: 4 }}>
      <Button startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)} sx={{ mb: 2 }}>{t('common.back')}</Button>
      <Typography variant="h4" sx={{ mb: 3 }}>{t('board.title')}</Typography>
      <DragDropContext onDragEnd={onDragEnd}>
        <Box sx={{ display: 'flex', gap: 3, alignItems: 'flex-start' }}>
          {Object.keys(boards).map((boardKey) => (
            <Droppable droppableId={boardKey} key={boardKey}>
              {(provided: any, snapshot: any) => (
                <Paper
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  elevation={0}
                  sx={{
                    flex: 1,
                    minWidth: 0,
                    p: 2,
                    minHeight: 300,
                    borderRadius: '16px',
                    border: 1,
                    borderColor: snapshot.isDraggingOver ? 'primary.main' : 'divider',
                    bgcolor: 'background.paper',
                    transition: 'border-color 0.2s',
                  }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6">{t('board.' + boardKey)}</Typography>
                    <Chip label={boards[boardKey].length} size="small" color="primary" />
                  </Box>
                  {boards[boardKey].map((post: any, index: number) => (
                    <Draggable key={post.id} draggableId={String(post.id)} index={index}>
                      {(provided: any, snapshot: any) => (
                        <Card
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          style={provided.draggableProps.style}
                          elevation={snapshot.isDragging ? 8 : 1}
                          sx={{ mb: 1.5, bgcolor: 'background.default' }}
                        >
                          {post.image && (
                            <CardMedia component="img" image={post.image} sx={{ height: 100, objectFit: 'cover' }} />
                          )}
                          <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
                            <Typography variant="body2">{post.title}</Typography>
                          </CardContent>
                        </Card>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </Paper>
              )}
            </Droppable>
          ))}
        </Box>
      </DragDropContext>
    </Box>
  );
}

export default BoardPage;