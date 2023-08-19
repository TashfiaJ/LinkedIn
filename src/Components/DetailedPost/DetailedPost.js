import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import { AuthContext } from '../../Hooks/AuthContext';

function DetailedPost() {
  const [post, setPost] = useState({});
  const { postId } = useParams(); // Retrieve postId from URL parameter
  const authContext = useContext(AuthContext);

  useEffect(() => {
    fetchPost();
  }, []);

  const fetchPost = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/posts/${postId}`);
      setPost(response.data.post);
    } catch (error) {
      console.error('Error fetching post:', error);
    }
  };

  const handleLogout = () => {
    authContext.logout();
  };

  return (
<div className="detailed-post container mt-4">
<div className="row independent">
        {authContext.token ? (
          <div>
  <button className="login-btn" onClick={handleLogout}>
    Logout
  </button>
  <button className="login-btn">{authContext.username}</button>
  <Link to="/post">
    <button className="login-btn">Feed</button>
  </Link>
</div>
        ) : (
          <div>
        <Link to="/login">
            <button className="login-btn">Login/Signup</button>
          </Link>
          </div>
        )}
      </div>
      <br></br><br></br>

  <div className="card post-card">
    <div className="card-body">
      <h2 className="card-title head-main">Post Details</h2>
      <div className="post-content">
        <p className='p-xtra'><strong>User:</strong> {post.username}</p>
        <p> {post.content}</p>
        {post.image && <img src={post.image} alt="Post" className="img-fluid rounded" />}
      </div>
    </div>
  </div>
</div>

  );
}

export default DetailedPost;