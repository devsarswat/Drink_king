import React, { useContext, useState } from 'react';
import axios from 'axios';
import { Button, TextField, Container, Typography, Box } from '@mui/material';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Acontext } from '../App';
import bcrypt from 'bcryptjs';
import Config from '../Config';
import { useNavigate } from 'react-router-dom';

const Settings = () => {
  const { user, setuser ,setisLogin} = useContext(Acontext);
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [message, setMessage] = useState('');
  const [currentPasswordCorrect, setCurrentPasswordCorrect] = useState(false);
  const [deleteAccount, setDeleteAccount] = useState(false);
  const nevigate =useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setMessage('');
  };

  const fetchData = async () => {
    try {
      const res = await axios.get(`${Config.apikeyuserdata}/${user.id}`);
      setuser(res.data);
      localStorage.setItem('userid', JSON.stringify(res.data));
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  // const handleDeleteAccount = async () => {
  //   try {
  //     const isMatch = await bcrypt.compare(formData.currentPassword, user.password);
  //     if (!isMatch) {
  //       setMessage('Current password is incorrect. Cannot delete account.');
  //       return;
  //     }
  
  //     await axios.delete(`${Config.apikeyuserdata}/${user.id}`);
  //     setMessage('Account deleted successfully.');
  //     setCurrentPasswordCorrect(false);
  //     setDeleteAccount(false);
  //     setisLogin(localStorage.removeItem('userid'));
  //     setuser(null);
  //     nevigate("/")
  //   } catch (error) {
  //     setMessage('An error occurred while deleting the account.');
  //     console.error(error);
  //   }
  // };
  const handleDeleteAccount = async () => {
    try {
      const isMatch = await bcrypt.compare(formData.currentPassword, user.password);
      if (!isMatch) {
        setMessage('Current password is incorrect. Cannot delete account.');
        return;
      }
  
      // If the password is correct, proceed with the account deletion.
      await axios.delete(`${Config.apikeyuserdata}/${user.id}`);
      setMessage('Account deleted successfully.');
      setisLogin(false); // Set 'isLogin' to false instead of removing from localStorage
      setuser(null);
      nevigate("/");
    } catch (error) {
      setMessage('An error occurred while deleting the account.');
      console.error(error);
    }
  };
  

  const handleSubmit = async () => {
    if (deleteAccount) {
      handleDeleteAccount();
      return; 
    }

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
          setCurrentPasswordCorrect(false);
          fetchData();
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
        <Typography variant="h4">Settings</Typography>
      </Box>
      <Box>
        {!currentPasswordCorrect && !deleteAccount ? (
          <>
          <div className='setting'>
            <Button variant="contained" color="primary" className='my-2' onClick={() => setDeleteAccount(true)}>
              Delete Account
            </Button>
            <Button variant="contained" color="primary" className='my-2' onClick={() => setCurrentPasswordCorrect(true)}>
              Change Password
            </Button>
            </div>
          </>
        ) : (
          <>
            {deleteAccount ? (
              <>
                <Typography variant="h6">Are you sure you want to delete your account?</Typography>
                <TextField
                  label="Password"
                  fullWidth
                  name="currentPassword"
                  type="password"
                  value={formData.currentPassword}
                  onChange={handleChange}
                  variant="outlined"
                  margin="normal"
                />
                <Button variant="contained" color="secondary" className='mx-2' onClick={handleDeleteAccount}>
                  Confirm Delete
                </Button>
                <Button variant="contained" color="primary" className='my-2 mx-2' onClick={() => setDeleteAccount(false)}>
                  Cancel
                </Button>
              </>
            ) : (
              <>
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
                <Button variant="contained" color="primary" className='mx-2' onClick={handleSubmit}>
                  Update Password
                </Button>
                <Button variant="contained" color="secondary"  className='my-2' onClick={() => setCurrentPasswordCorrect(false)}>
                  Cancel
                </Button>
              </>
            )}
          </>
        )}
        {message && <div>{message}</div>}
      </Box>
    </Container>
  );
};

export default Settings;
