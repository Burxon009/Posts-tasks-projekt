import { useEffect, useState } from "react";
import { usePostsStore } from "./postsStore";
import { BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useTranslation } from "react-i18next";

const isLocalPost = (id: number) => id > 100;

function PostPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [post, setPost] = useState<any>(null);
  const storePosts = usePostsStore((state) => state.posts);
  const [allPosts, setAllPosts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [scale, setScale] = useState(1);
  const [showControls, setShowControls] = useState(false);
  useEffect(() => {
    if (isLocalPost(Number(id))) {
      const found = storePosts.find((p) => p.id === Number(id));
      if (found) {
        setPost(found);
        setIsError(false);
      } else {
        setIsError(true);
      }
      setIsLoading(false);
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


  useEffect(() => {
    fetch('https://jsonplaceholder.typicode.com/posts')
      .then((response) => response.json())
      .then((data) => setAllPosts(data));
  }, []);

  if (isLoading) {
    return <div>{t('common.loading')}</div>;
  }

  if (isError || !post) {
    return <div>{t('post.notFound')}</div>;
  }

    const lengths = allPosts.map((p) => p.title.length + p.body.length);
  const maxLength = Math.max(...lengths);
  const minLength = Math.min(...lengths);
  const thisLength = post.title.length + post.body.length;

  const chartData = [
    { name: t('post.thisPost'), Stolb: thisLength },
    { name: t('post.longest'), Stolb: maxLength },
    { name: t('post.shortest'), Stolb: minLength },
  ];

  return (
    <div style={{ padding: '50p', lineHeight: '1.5'}}>
      <Button startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)}>{t('common.back')}</Button>
      {post.image && (
        <div
          onMouseEnter={() => setShowControls(true)}
          onMouseLeave={() => setShowControls(false)}
          style={{ position: 'relative', overflow: 'hidden' }}
        >
          <img
            src={post.image}
            style={{
              width: '100%',
              transform: `rotate(${rotation}deg) scale(${scale})`,
            }}
          />
          {showControls && (
            <div style={{ position: 'absolute', top: 0, right: 0, background: 'rgba(0,0,0,0.6)', padding: '4px' }}>
              <button title={t('post.rotateLeft')} onClick={() => setRotation(rotation - 90)}>⟲</button>
              <button title={t('post.rotateRight')} onClick={() => setRotation(rotation + 90)}>⟳</button>
              <button title={t('post.zoomIn')} onClick={() => setScale(scale + 0.1)}>+</button>
              <button title={t('post.zoomOut')} onClick={() => setScale(scale - 0.1)}>-</button>
            </div>
          )}
        </div>
      )}
      <h1 style={{ marginBottom: '50px' }}>{post.title}</h1>
      <p>{post.body}</p>

      <BarChart width={400} height={300} data={chartData}>
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="Stolb" fill="#8884d8" />
      </BarChart>
    </div>
  );
}

export default PostPage;
