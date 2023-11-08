import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../Hooks/AuthContext';
import "./Notification.css";

const NotificationsList = () => {
  const [notifications, setNotifications] = useState([]);
  const authContext = useContext(AuthContext);
  const [username, setUsername] = useState(""); // You can set the initial value of username here

  useEffect(() => {
    // Assuming you have a way to get the username from your AuthContext or some other source
    const user = authContext.username; // Replace this with the actual way to get the username
    // Check if the user is available
    if (user ) {
      setUsername(user);
      // Fetch notifications when the component mounts
      fetchNotifications(user);
    }
  }, []);

  const fetchNotifications = async (username) => {

    console.log(username);
    
    try {
      const response = await axios.get(`http://localhost:8003/notification/get_notification?user_id=${username}`, {
      });
      setNotifications(response.data);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  return (
    <div>
      <h1>Notifications</h1>
      <ul>
        {notifications.map((notification, index) => (
          <li key={index}>{notification}</li>
        ))}
      </ul>
    </div>
  );
};

export default NotificationsList;
