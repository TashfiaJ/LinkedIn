import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './PostList.css';

function PostsList({ key }) { // Accept the key prop
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetchPosts();
  }, [key]); // Include the key prop in the dependency array

  const fetchPosts = async () => {
    try {
      const response = await axios.get('http://localhost:8000/posts/');
      
      // Sort posts by creation timestamp in descending order
      const sortedPosts = response.data.posts.sort((a, b) => {
        const timestampA = new Date(a.created_at).getTime();
        const timestampB = new Date(b.created_at).getTime();
        return timestampB - timestampA;
      });
      
      setPosts(sortedPosts);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  return (
    <>
      <div className="posts-list">
        <h2 className="head-main text-left">Recent Posts</h2>
      </div>
      <div className="container mt-4">
        <ul className="list-group">
          {posts.map((post, index) => (
            <li key={index} className="list-group-item post">
              <div className="d-flex align-items-start">
                <div className="post-content">
                  <div className="d-flex justify-content-between">
                    <h5 className="mb-1">
                      <span className="text-bold text-xtra" style={{ color: '#FF914D' }}>{post.email}</span>
                    </h5>
                    <small>{post.created_at}</small>
                  </div>
                  <p className="mb-2 text-center my-2">{post.content}</p>
                  <div className="d-flex flex-column align-items-center">
                    {post.image && (
                      <img
                        src={post.image}
                        alt="Post"
                        className="img-fluid rounded"
                      />
                    )}
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

export default PostsList;