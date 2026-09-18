import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const isLocalPost = (id: number) => id > 100;

function PostPage() {
  const { id } = useParams();
  const [post, setPost] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    if (isLocalPost(Number(id))) {
      setIsLoading(false);
      setIsError(true);
      return;
    }

    setIsLoading(true);
    setIsError(false);

    fetch(`https://jsonplaceholder.typicode.com/posts/${id}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('not found');
        }
        return response.json();
      })
      .then((data) => {
        setPost(data);
        setIsLoading(false);
      })
      .catch(() => {
        setIsError(true);
        setIsLoading(false);
      });
  }, [id]);

  if (isLoading) {
    return <div>Загрузка идёт...</div>;
  }

  if (isError || !post) {
    return <div>Пост не найден</div>;
  }

  return (
    <div style={{ padding: '50p', lineHeight: '1.5'}}>
      {post.image && (
        <img src={post.image} style={{ width: '100%' }} />
      )}
      <h1 style={{ marginBottom: '50px' }}>{post.title}</h1>
      <p>{post.body}</p>
    </div>
  );
}

export default PostPage;
