import React, { useContext, useState } from 'react';
import axios from 'axios';
import { Button, TextField, Container, Typography, Box } from '@mui/material';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Acontext } from '../App';
import bcrypt from 'bcryptjs';
import Config from '../Config';

const Settings = () => {
  const { user, setuser } = useContext(Acontext);
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [message, setMessage] = useState('');
  const [currentPasswordCorrect, setCurrentPasswordCorrect] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setMessage('');
  };

  const fetchData = async () => {
    try {
      const res = await axios.get(`${Config.apikeyuserdata}/${user.id}`);
      setuser(res.data);
      localStorage.setItem("userid", JSON.stringify(res.data));
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const handleSubmit = async () => {
    if (!currentPasswordCorrect) {
      const isMatch = await bcrypt.compare(formData.currentPassword, user.password);
      if (!isMatch) {
        setMessage('Current password is incorrect.');
      } else {
        setMessage('');
        setCurrentPasswordCorrect(true);
      }
    } else {
      if (formData.newPassword !== formData.confirmPassword) {
        setMessage('New password and confirm password must match.');
      } else if (!formData.newPassword || !formData.confirmPassword) {
        setMessage('New password and confirm password cannot be empty.');
      } else {
        try {
          const hashedPassword = await bcrypt.hash(formData.newPassword, 10);
          await axios.patch(`${Config.apikeyuserdata}/${user.id}`, {
            password: hashedPassword,
            confirmpassword: hashedPassword,
          });
          setMessage('Password updated successfully.');
          setFormData({
            currentPassword: '',
            newPassword: '',
            confirmPassword: '',
          });
          fetchData();
          setCurrentPasswordCorrect(false)
        } catch (error) {
          setMessage('An error occurred while updating the password.');
          console.error(error);
        }
      }
    }
  };

  return (
    <Container maxWidth="sm">
      <Box mt={5} mb={2}>
        <Typography variant="h4">Update Password</Typography>
      </Box>
      <Box>
        {!currentPasswordCorrect ? (<>
          <TextField
            label="Current Password"
            fullWidth
            name="currentPassword"
            type="password"
            value={formData.currentPassword}
            onChange={handleChange}
            variant="outlined"
            margin="normal"
          />
          <Button variant="contained" color="primary" onClick={handleSubmit}>
          Next
        </Button>
        </>
        ) : (
          <>
            <TextField
              label="New Password"
              fullWidth
              name="newPassword"
              type="password"
              value={formData.newPassword}
              onChange={handleChange}
              variant="outlined"
              margin="normal"
            />
            <TextField
              label="Confirm Password"
              fullWidth
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              variant="outlined"
              margin="normal"
            />
            <Button variant="contained" color="primary" onClick={handleSubmit}>
          Update Password
        </Button>
          </>
        )}
        {message && <div>{message}</div>}
      </Box>
    </Container>
  );
};

export default Settings;
