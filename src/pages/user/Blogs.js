import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Typography, Card, CardContent, CardMedia, Button } from '@mui/material';

const BlogPost = ({ title, description, image, link }) => {
  return (
    <Card className="max-w-xl mx-auto mb-8">
      <CardMedia component="img" height="200" image={image} alt={title} />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {title}
        </Typography>
        <Typography variant="body2" color="textSecondary" component="p">
          {description}
        </Typography>
        <Button size="small" color="primary" href={link} sx={{ textAlign: 'center' }}>
          Read More
        </Button>
      </CardContent>
    </Card>
  );
};

const BlogPostsPage = () => {
  const [posts, setPosts] = useState([]);
  // const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:3001/api/user/blogs/getAll', {
          headers: {
            Authorization: `${token}`
          }
        });
        if (response.data.success) {
          setPosts(response.data.data);
        } else {
          console.error('Failed to fetch blog data:', response.data.message);
        }
      } catch (error) {
        console.error('Error fetching blog data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  return (
    <div className="container mx-auto p-4">
      {loading && <p className="text-center mt-4">Loading...</p>}
      {!loading && posts.length === 0 && (
        <Typography variant="h4" color="textSecondary" align="center" sx={{ mt: 4 }}>
          There are no blogs available.
        </Typography>
      )}
      {posts.map((post, index) => (
        <BlogPost key={index} title={post.blog_title} description={post.blog_description} image={post.image_url} link={post.source_url} />
      ))}
    </div>
  );
};

export default BlogPostsPage;
