import { useEffect, useState } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { usePostsStore } from './postsStore';

function BoardPage() {
  const storePosts = usePostsStore((state) => state.posts);
  const [boards, setBoards] = useState<any>({
    new: [],
    favorite: [],
    archive: [],
  });

  useEffect(() => {
    setBoards((old: any) => ({
      ...old,
      new: storePosts,
    }));
  }, []);

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

  return (
    <div>
      <h2>Доски</h2>
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
                  <h3>{boardKey}</h3>
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