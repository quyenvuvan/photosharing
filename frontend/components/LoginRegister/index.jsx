import React, { useState } from 'react';
import { Button, TextField, Grid, Paper, Typography } from '@mui/material';

const LoginRegister = ({ setUser }) => {
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [registerUsername, setRegisterUsername] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [occupation, setOccupation] = useState('');

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch('https://psrdvv-8081.csb.app/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ login_name: loginUsername, password: loginPassword }),
      });

      if (!response.ok) {
        throw new Error('Login failed. Please check your login name and password.');
      }
      const data = await response.json();
      localStorage.setItem('token', data.token);
      setUser(data.user);
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  };

  const handleRegister = async (event) => {
    event.preventDefault();
    if (registerPassword !== confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    try {
      const response = await fetch('https://psrdvv-8081.csb.app/user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          login_name: registerUsername,
          password: registerPassword,
          first_name: firstName,
          last_name: lastName,
          location: location,
          description: description,
          occupation: occupation,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Registration failed.');
      }

      alert('Registration successful!');
      setRegisterUsername('');
      setRegisterPassword('');
      setConfirmPassword('');
      setFirstName('');
      setLastName('');
      setLocation('');
      setDescription('');
      setOccupation('');
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={6}>
        <Paper style={{ padding: 16 }}>
          <Typography variant="h5">Login</Typography>
          <form onSubmit={handleLogin}>
            <TextField
              label="Username"
              value={loginUsername}
              onChange={(e) => setLoginUsername(e.target.value)}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Password"
              type="password"
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
              fullWidth
              margin="normal"
            />
            <Button type="submit" variant="contained" color="primary">
              Login
            </Button>
          </form>
        </Paper>
      </Grid>
      <Grid item xs={12} sm={6}>
        <Paper style={{ padding: 16 }}>
          <Typography variant="h5">Register</Typography>
          <form onSubmit={handleRegister}>
            <TextField
              label="Username"
              value={registerUsername}
              onChange={(e) => setRegisterUsername(e.target.value)}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Password"
              type="password"
              value={registerPassword}
              onChange={(e) => setRegisterPassword(e.target.value)}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Confirm Password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              fullWidth
              margin="normal"
            />
            <TextField
              label="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Occupation"
              value={occupation}
              onChange={(e) => setOccupation(e.target.value)}
              fullWidth
              margin="normal"
            />
            <Button type="submit" variant="contained" color="primary">
              Register Me
            </Button>
          </form>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default LoginRegister;

