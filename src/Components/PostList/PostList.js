// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import './PostList.css';

// function PostsList({ key }) { // Accept the key prop
//   const [posts, setPosts] = useState([]);

//   useEffect(() => {
//     fetchPosts();
//   }, [key]); // Include the key prop in the dependency array

//   const fetchPosts = async () => {
//     try {
//       const response = await axios.get('http://localhost:8000/getpost');
      
//       // Sort posts by creation timestamp in descending order
//       const sortedPosts = response.data.posts.sort((a, b) => {
//         const timestampA = new Date(a.created_at).getTime();
//         const timestampB = new Date(b.created_at).getTime();
//         return timestampB - timestampA;
//       });
      
//       setPosts(sortedPosts);
//     } catch (error) {
//       console.error('Error fetching posts:', error);
//     }
//   };

//   return (
//     <>
//       <div className="posts-list">
//         <h2 className="head-main text-left">Recent Posts</h2>
//       </div>
//       <div className="container mt-4">
//         <ul className="list-group">
//           {posts.map((post, index) => (
//             <li key={index} className="list-group-item post">
//               <div className="d-flex align-items-start">
//                 <div className="post-content">
//                   <div className="d-flex justify-content-between">
//                     <h5 className="mb-1">
//                       <span className="text-bold text-xtra" style={{ color: '#FF914D' }}>{post.email}</span>
//                     </h5>
//                     <small>{post.created_at}</small>
//                   </div>
//                   <p className="mb-2 text-center my-2">{post.content}</p>
//                   <div className="d-flex flex-column align-items-center">
//                     {post.image && (
//                       <img
//                         src={post.image}
//                         alt="Post"
//                         className="img-fluid rounded"
//                       />
//                     )}
//                   </div>
//                 </div>
//               </div>
//             </li>
//           ))}
//         </ul>
//       </div>
//     </>
//   );
// }

// export default PostsList;




import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { AuthContext } from '../../Hooks/AuthContext'; // Import your AuthContext


function PostList() {
  const authContext = useContext(AuthContext);
  const [posts, setPosts] = useState([]);
  console.log("kireee");

  const [username, setUsername] = useState(""); // You can set the initial value of username here

  useEffect(() => {
    // Assuming you have a way to get the username from your AuthContext or some other source
    const user = authContext.username; // Replace this with the actual way to get the username
    // Check if the user is available
    if (user ) {
      setUsername(user);
      fetchData(user);
    }
  }, []);

    // Fetch recent posts excluding the logged-in user's posts
    const fetchData = async (username) => {
      try {
        const response = await axios.get(`http://localhost:8000/getpost?user_id=${username}`, { },
        );
        const posts = response.data;
        console.log(posts);
        setPosts(posts);
        // Update your state to store and display the posts
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };

 
// The empty dependency array ensures this effect runs only once on component mount

  return (
    <div>
    {posts.map((post) => (
      <div key={post.id}>
        <h4>{post.username}</h4>
        <p>{post.texts}</p>
        {post.image_url && (
          <img src={post.image_url} alt="Post" />
        )}
      </div>
    ))}
  </div>
  );
}

export default PostList;
