import { useEffect} from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { usePostsStore } from './postsStore';
import { useNavigate } from 'react-router-dom';
import { Button } from '@mui/material';
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
    <div>
      <Button startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)}>{t('common.back')}</Button>
      <h2>{t('board.title')}</h2>
      <DragDropContext onDragEnd={onDragEnd}>
        <div style={{ display: 'flex', gap: '20px', padding: '20px' }}>
          {Object.keys(boards).map((boardKey) => (
            <Droppable droppableId={boardKey} key={boardKey}>
              {(provided: any) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  style={{ flex: 1, border: '1px solid gray', padding: '10px', minHeight: '300px' }}
                >
                  <h3>{t('board.' + boardKey)}</h3>
                  {boards[boardKey].map((post: any, index: number) => (
                    <Draggable key={post.id} draggableId={String(post.id)} index={index}>
                      {(provided: any) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          style={{ border: '1px solid gray', margin: '10px 0', padding: '10px', ...provided.draggableProps.style }}
                        >
                          {post.image && (
                            <img src={post.image} style={{ width: '100%', height: '100px', objectFit: 'cover', marginBottom: '8px' }} />
                          )}
                          {post.title}
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
}

export default BoardPage;