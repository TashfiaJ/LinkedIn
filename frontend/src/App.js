import './App.css';
import { Routes, Route } from 'react-router-dom';
import { useState, useEffect, useContext } from 'react';
import Navigation from './Components/Navbar/Navbar';
import LoginForm from './Components/Auth/Login';
import Register from './Components/Auth/Register';
import { AuthContext } from './Hooks/AuthContext';
import Post from './Components/Post/Post';
import PostsList from './Components/PostList/PostList';
import Notification from './Components/Notification/Notification';
import DetailedPost from './Components/DetailedPost/DetailedPost';
import PostMain from './Components/Post/PostMain'
import Timeline from './Components/Post/Timeline'


function App() {

  const [token, setToken] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const authContext = useContext(AuthContext);

  // console.log(props.user.email)
  // console.log(props.user.secret)

  useEffect(() => {
    if (authContext.token) {
      console.log(authContext.email);
      setToken(authContext.token);
      setEmail(authContext.email);
      setPassword(authContext.password);
    }
  }, []);

  return (
    <div className="App">
    <Routes>
      <Route path="/" element={
        <LoginForm />
        } />
     
      <Route path="/login" element={<LoginForm />} />
      <Route path="/register" element={<Register />} />
    
      <Route path="*" element={<div><p className="text-light">Page Not Found!</p></div>} />
   
      <Route path="/post" element={<PostMain />} />
      <Route path="/postList" element={<PostsList />} />
      <Route path="/notification" element={<Notification/>} />
      <Route path="/timeline" element={<Timeline/>} />
      <Route path="/posts/:postId" element={<DetailedPost/>} />


    </Routes>
    </div>
  );
  
  

}

export default App;