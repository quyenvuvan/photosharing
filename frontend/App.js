import './App.css';
import {useState, useEffect} from 'react';
import React from "react";
import { Grid, Typography, Paper } from "@mui/material";
import { BrowserRouter as Router, Route, Routes, useNavigate } from "react-router-dom";
import TopBar from "./components/TopBar";
import UserDetail from "./components/UserDetail";
import UserList from "./components/UserList";
import UserPhotos from "./components/UserPhotos";
import LoginRegister from "./components/LoginRegister";

const MainApp = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const[users,setUsers]=useState([])
  useEffect(() => {
    if (!user) {
      navigate('/admin/login');
    }
  }, [user, navigate]);
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('https://psrdvv-8081.csb.app/users');
        if (!response.ok) {
          throw new Error('Failed to fetch users');
        }
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error(error);
        alert('Failed to fetch users');
      }
    };
    fetchUsers();
  }, []);
  if (!user) {
    return (
      <div>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TopBar user={user} users={users} setUser={setUser}/>
          </Grid>
          <div className="main-topbar-buffer" />
          <Grid item sm={12}>
            <Paper className="main-grid-item">
              <Routes>
                <Route path="admin/login" element={<LoginRegister setUser={setUser}/>} />
              </Routes>
            </Paper>
          </Grid>
        </Grid>
      </div>
    );
  }
  return (
    <div>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TopBar user={user} users={users} setUser={setUser}/>
        </Grid>
        <div className="main-topbar-buffer" />
        <Grid item sm={3}>
          <Paper className="main-grid-item">
            <UserList setUsers={setUsers}/>
          </Paper>
        </Grid>
        <Grid item sm={9}>
          <Paper className="main-grid-item">
            <Routes>
              <Route
                  path="users/:userId"
                  element = {<UserDetail users={users}/>}
              />
              <Route
                  path="/photos/:userId"
                  element = {<UserPhotos users={users}/>}
              />
              <Route path="/users" element={<UserList setUsers={setUsers}/>} />
            </Routes>
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
}

const App = (props) => {
  return (
    <Router>
      <MainApp />
    </Router>
  );
}

export default App;
