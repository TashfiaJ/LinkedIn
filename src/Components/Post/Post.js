import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../Hooks/AuthContext';
import PostsList from '../PostList/PostList';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell } from '@fortawesome/free-solid-svg-icons';

function Post() {
  const [content, setContent] = useState('');
  const [imageFile, setImageFile] = useState(null); // Store the selected image file
  const [postCounter, setPostCounter] = useState(0); // State to track successful posts
  const authContext = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let imageData = null;
      if (imageFile) {
        const reader = new FileReader();
        reader.onload = (event) => {
          imageData = event.target.result;
          createPost(imageData);
        };
        reader.readAsDataURL(imageFile);
      } else {
        createPost(imageData);
      }
    } catch (error) {
      console.error('Error creating post:', error);
      alert('An error occurred while creating the post.');
    }
  };

  const createPost = async (imageData) => {
    const postData = {
      email: authContext.email,
      content: content,
      image: imageData,
    };

    try {
      await axios.post('http://localhost:8000/posts/', postData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      setContent('');
      setImageFile(null); // Reset the image file state
      setPostCounter((prevCounter) => prevCounter + 1); // Increment the counter
      alert('Post created successfully!');
    } catch (error) {
      console.error('Error creating post:', error);
      alert('An error occurred while creating the post.');
    }
  };

  useEffect(() => {
    // You can use this effect to perform additional actions when the counter changes
    // For example, update UI elements or make additional API requests
  }, [postCounter]);

  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleLogout = () => {
    authContext.logout();
  };

  return (
    <div className="post-form">
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
  <Link to="/notification" className="notification-icon">
  <div className="notification-box">
    <FontAwesomeIcon
      icon={faBell}
      size="lg"
      style={{
        color: "#FF914D",
        marginTop: "27px",
        marginLeft: "1200px"
      }}
    />
    {postCounter > 0 && (
      <span className="notification-counter" style={{
        marginTop: "27px",
        marginLeft: "1250px"
      }}>{postCounter}</span>
    )}
  </div>
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
      <h2 className='head-main'>Create a New Post</h2>
      <div className='poster d-flex justify-content-center align-items-center'>
      <form onSubmit={handleSubmit} className="border p-3 shadow rounded">
        <div className="mb-3">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write something..."
            className="form-control"
            rows="4"
          />
        </div>
        <div className="mb-3">
          <input type="file" onChange={handleImageChange} className="form-control" />
        </div>
        <button type="submit" className="btn-xtra">
          Post
        </button>
      </form>
      </div>
      <PostsList key={postCounter}/>
    </div>
  );
}

export default Post