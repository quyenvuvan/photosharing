import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { useLocation } from 'react-router-dom';
import models from '../../modelData/models';
import './styles.css';
import UploadPhoto from '../UploadPhoto';

function TopBar({user,users,setUser}) {
  const location = useLocation();
 
  const handleLogout = async () => {
    try {
      const response = await fetch('https://psrdvv-8081.csb.app/admin/logout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        throw new Error('Logout failed');
      }
      localStorage.removeItem('token');
      setUser(null);
      
    } catch (error) {
      console.error(error);
      alert('Logout failed. Please try again.');
    }
  };

  const context = getContext(location.pathname, users,user);

  return (
    <AppBar className="topbar-appBar" position="absolute">
      <Toolbar>
        <Typography variant="h5" color="inherit" style={{ flexGrow: 1 }}>
          Vũ Văn Quyền B21DCCN640{
            user ?(<div><UploadPhoto/></div>):''
          }
        </Typography>
        <Typography variant="h5" color="inherit" style={{ marginRight: '16px' }}>
          {context}
        </Typography>
        {user ? (
            <div>Hi {user.first_name} 
          <Button color="inherit" onClick={handleLogout}>
            Log Out
          </Button></div>
        ) : (
          <Typography variant="h6" color="inherit">
            Please Login
          </Typography>
        )}
      </Toolbar>
    </AppBar>
  );
}

function getContext(pathname, users,user) {
  if(user){
  if (pathname.includes('/users/')) {
    const userId = pathname.split('/users/')[1].split('/')[0];
    return `Viewing user ${users.find(u=>u._id==userId).first_name}`;
  } else if (pathname.includes('/photos/')) {
    const userId = pathname.split('/photos/')[1].split('/')[0];
    return `Photos of user ${users.find(u=>u._id==userId).first_name}`;
  } else {
    return '';
  }}
}

export default TopBar;


