import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../Hooks/AuthContext';

function Notification() {
  const [notifications, setNotifications] = useState([]);
  const authContext = useContext(AuthContext);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await axios.get('http://localhost:8000/notifications/');
      const notificationsWithClicked = response.data.notifications.map(notification => ({
        ...notification,
        clicked: false
      }));
      setNotifications(notificationsWithClicked);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const handleLogout = () => {
    authContext.logout();
  };

  const handleNotificationClick = (index) => {
    const updatedNotifications = [...notifications];
    updatedNotifications[index].clicked = true;
    setNotifications(updatedNotifications);
  };

  return (
    <div className="notification-list container mt-4">
      <div className="row independent">
        {authContext.token ? (
          <div>
            <button className="login-btn" onClick={handleLogout}>
              Logout
            </button>
            <button className="login-btn">{authContext.email}</button>
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
      <h2 className="head-main">Notifications</h2>
      <div className="row">
        {notifications.map((notification, index) => {
          const timestamp = new Date(notification.created_at).getTime();
          const currentTime = new Date().getTime();
          const timeDifference = Math.floor((currentTime - timestamp) / (1000 * 60)); // Time difference in minutes

          return (
            <div key={index} className="col-md-6 mb-4">
              <div className="card notification-card">
                <div className="card-body">
                  <Link
                    to={`/posts/${index + 1}`}
                    className="notification-link"
                    style={{ textDecoration: 'none', color: notification.clicked ? 'gray' : 'black' }}
                    onClick={() => handleNotificationClick(index)}
                  >
                    <p className="card-text-xtra">
                      {notification.notification} - {notification.created_at} - {timeDifference-360} mins ago
                    </p>
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Notification;