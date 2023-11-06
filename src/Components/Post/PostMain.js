// Home.js
import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../Hooks/AuthContext'; // Import your AuthContext
import PostList from '../PostList/PostList';// Create a PostList component to display recent posts
import "./PostMain.css";

function Home() {
  const authContext = useContext(AuthContext);
  const [content, setContent] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [username, setUsername] = useState("");
  

  const handlePostSubmit = async () => {
    const formData = new FormData();
    formData.append('username', authContext.username);
    formData.append('texts', content);
    if (imageFile) {
      formData.append('image_file', imageFile);
    }

    try {
      await axios.post('http://localhost:8000/post', formData, {
        headers: {
          'Content-Type': 'multipart/form-data', // Important for file upload
        },
      });


      setContent('');
      setImageFile(null);
      alert('Post created successfully!');
    } catch (error) {
      console.error('Error creating post:', error);
      alert('An error occurred while creating the post.');
    }
  };

  useEffect(() => {
    // Fetch recent posts using the /getpost endpoint and display them
    // You can create a PostList component for this purpose
  }, []); // Make sure to run this effect only once when the component mounts

  return (
    <div>
      {authContext.isLoggedIn ? (
                <div className="user-info">
                <button onClick={authContext.logout}>Logout</button>
                <button className="username-button"> {authContext.username} </button>
              </div>
      ) : (
        <div>
            <Link to="/login">
            <button className="login-btn">Login/Signup</button>
            </Link>
            </div>
      )}

      <div className="post-section">
        <h2>Create a New Post</h2>
        <div className="post-input-container">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write something..."
            rows="4"
            style={{ width: "70%" }}
          />
          <input type="file" onChange={(e) => setImageFile(e.target.files[0])} />
          <button onClick={handlePostSubmit}>Post</button>
        </div>
      </div>

      {authContext.isLoggedIn && (
        <div>
        <div>
        <Link to="/notification">
        <button className="notification-icon">🔔</button>
      </Link>
      </div>
        <div>
          <h2>Recent Posts</h2>
          <PostList />
        </div>
      </div>
      )}
    </div>
  );
}

export default Home;
