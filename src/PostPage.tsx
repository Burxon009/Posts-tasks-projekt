import { useParams } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";

function PostPage() {
  const { id } = useParams();
  const queryClient = useQueryClient();

  const cachedPosts: any = queryClient.getQueryData(['posts']);
  const cachedPost = cachedPosts?.find((p: any) => String(p.id) === id);

  const { data, isPending, isError } = useQuery({
    queryKey: ['post', id],
    queryFn: async () => {
      const response = await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`);
      if (!response.ok) {
        throw new Error('not found');
      }
      return response.json();
    },
    initialData: cachedPost,
    enabled: !cachedPost,
  });

  const post = cachedPost ?? data;

  if (isPending && !cachedPost) {
    return <div>Загрузка идёт...</div>;
  }

  if (isError && !cachedPost) {
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
