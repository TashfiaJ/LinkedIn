import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../Hooks/AuthContext';


const TimeLine = () => {
    const [posts, setPosts] = useState([]);
    const authContext = useContext(AuthContext);
    const [username, setUsername] = useState("");

    useEffect(() => {
        const user = authContext.username;
        if (user ) {
          setUsername(user);
          fetchPosts(user);
        }
      }, []);

      const fetchPosts = async (username) => {

        console.log(username);
        
        try {
          const response = await axios.get(`http://localhost:8002/post/gettimeline?user_id=${username}`, {
          });
          setPosts(response.data);
        } catch (error) {
          console.error('Error fetching posts:', error);
        }
      };

      return (
        <div>
        <h1>Profile</h1>
        {posts.map((post) => (
          <div key={post.id}>
            <h2>{post.username}</h2>
            <p>{post.texts}</p>
            {post.image_url && (
              <img src={post.image_url} alt="Post" />
            )}
          </div>
        ))}
      </div>
      );
};

export default TimeLine;