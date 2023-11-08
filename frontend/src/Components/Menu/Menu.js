import React from "react";
import "./Menu.css";

import { Link } from "react-router-dom";

const Menu = () => {
  return (
    <>
      <div className="row real-nav-menu">
        
        <div style={{
          paddingTop: "120px",
        }}>
         
          <Link to='/post' className="link-decoration">
            <p>Post</p>
          </Link>
          <Link to='/postList' className="link-decoration">
            <p>Post List</p>
          </Link>
          <Link to='/notification' className="link-decoration">
            <p>Notification</p>
          </Link>
         
        </div>
      </div>
      </>
  );
  
};

export default Menu;