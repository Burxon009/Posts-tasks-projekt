import { useEffect, useState } from "react";
import { usePostsStore } from "./postsStore";
import { BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import { useParams, useNavigate } from "react-router-dom";
import { Button, Box, Card, CardContent, Typography, IconButton, useTheme } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useTranslation } from "react-i18next";
import DOMPurify from "dompurify";

const isLocalPost = (id: number) => id > 100;

function PostPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const theme = useTheme();
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
    return <Box sx={{ p: 4 }}><Typography sx={{ color: 'text.secondary' }}>{t('common.loading')}</Typography></Box>;
  }

  if (isError || !post) {
    return (
      <Box sx={{ p: 4 }}>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)} sx={{ mb: 2 }}>{t('common.back')}</Button>
        <Typography sx={{ color: 'error.main' }}>{t('post.notFound')}</Typography>
      </Box>
    );
  }

    const lengths = allPosts.map((p) => p.title.length + p.body.length);
  const maxLength = Math.max(...lengths);
  const minLength = Math.min(...lengths);
  const bodyText = new DOMParser().parseFromString(post.body, 'text/html').body.textContent || '';
  const thisLength = post.title.length + bodyText.length;

  const chartData = [
    { name: t('post.thisPost'), Stolb: thisLength },
    { name: t('post.longest'), Stolb: maxLength },
    { name: t('post.shortest'), Stolb: minLength },
  ];

  return (
    <Box sx={{ p: 4 }}>
      <Button startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)} sx={{ mb: 2 }}>{t('common.back')}</Button>
      <Card elevation={2}>
        {post.image && (
          <Box
            onMouseEnter={() => setShowControls(true)}
            onMouseLeave={() => setShowControls(false)}
            sx={{ position: 'relative', overflow: 'hidden' }}
          >
            <Box
              component="img"
              src={post.image}
              sx={{
                width: '100%',
                display: 'block',
                transform: `rotate(${rotation}deg) scale(${scale})`,
              }}
            />
            {showControls && (
              <Box sx={{ position: 'absolute', top: 8, right: 8, bgcolor: 'rgba(0,0,0,0.6)', borderRadius: '8px', p: 0.5, display: 'flex' }}>
                <IconButton size="small" sx={{ color: '#fff' }} title={t('post.rotateLeft')} onClick={() => setRotation(rotation - 90)}>⟲</IconButton>
                <IconButton size="small" sx={{ color: '#fff' }} title={t('post.rotateRight')} onClick={() => setRotation(rotation + 90)}>⟳</IconButton>
                <IconButton size="small" sx={{ color: '#fff' }} title={t('post.zoomIn')} onClick={() => setScale(scale + 0.1)}>+</IconButton>
                <IconButton size="small" sx={{ color: '#fff' }} title={t('post.zoomOut')} onClick={() => setScale(scale - 0.1)}>-</IconButton>
              </Box>
            )}
          </Box>
        )}
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h4" sx={{ mb: 2 }}>{post.title}</Typography>
          <Typography
            component="div"
            sx={{ color: 'text.secondary', lineHeight: 1.7, mb: 4, '& p': { margin: 0 } }}
            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(post.body) }}
          />

          <BarChart width={520} height={300} data={chartData}>
            <XAxis dataKey="name" interval={0} tick={{ fill: theme.palette.text.secondary }} stroke={theme.palette.divider} />
            <YAxis tick={{ fill: theme.palette.text.secondary }} stroke={theme.palette.divider} />
            <Tooltip
              cursor={{ fill: theme.palette.action.hover }}
              contentStyle={{ background: theme.palette.background.paper, border: `1px solid ${theme.palette.divider}`, borderRadius: 8, color: theme.palette.text.primary }}
              labelStyle={{ color: theme.palette.text.primary }}
              itemStyle={{ color: theme.palette.primary.main }}
            />
            <Bar dataKey="Stolb" fill={theme.palette.primary.main} radius={[6, 6, 0, 0]} />
          </BarChart>
        </CardContent>
      </Card>
    </Box>
  );
}

export default PostPage;
