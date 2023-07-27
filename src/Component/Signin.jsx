import React, { useState } from "react";
import axios from "axios";
import { TextField, Button, Typography } from "@mui/material";
import validator from "validator";
import { useNavigate } from "react-router-dom";
import Config from "../Config";
import { toast } from "react-toastify";
import bcrypt from "bcryptjs"; 

const Signin = () => {
  const navigate = useNavigate();
  const data = {
    name: "",
    email: "",
    password: "",
    confirmpassword: "",
    role: "user",
  };

  const [formData, setFormData] = useState(data);
  const [errors, setErrors] = useState({});

  const handleValueChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length === 0) {
      bcrypt.genSalt(10, (err, salt) => {
        if (err) {
          console.error("Error generating salt:", err);
          return;
        }
        bcrypt.hash(formData.password, salt, (err, hashedPassword) => {
          if (err) {
            console.error("Error hashing password:", err);
            return;
          }

          const formDataWithEncryptedPasswords = {
            ...formData,
            password: hashedPassword,
            confirmpassword: hashedPassword, 
          };

          axios
            .post(Config.apikeyuserdata, formDataWithEncryptedPasswords)
            .then((res) => {
              toast.success("Registration Successfully");
              navigate("/login");
            })
            .catch((error) => {
              console.log(error);
              toast.error("Please Try Again");
            });
        });
      });
    } else {
      setErrors(validationErrors);
    }
  };

  const validateForm = () => {
    const errors = {};

    if (validator.isEmpty(formData.name)) {
      errors.name = "Name is required";
    }

    if (validator.isEmpty(formData.email)) {
      errors.email = "Email is required";
    } else if (!validator.isEmail(formData.email)) {
      errors.email = "Invalid email format";
    }

    if (validator.isEmpty(formData.password)) {
      errors.password = "Password is required";
    } else if (!validator.isLength(formData.password, { min: 6 })) {
      errors.password = "Password must be at least 6 characters long";
    }

    if (validator.isEmpty(formData.confirmpassword)) {
      errors.confirmPassword = "Confirm Password is required";
    } else if (!validator.equals(formData.password, formData.confirmpassword)) {
      errors.confirmPassword = "Passwords do not match";
    }

    if (validator.isEmpty(formData.role)) {
      errors.role = "Role is required";
    }

    return errors;
  };

  return (
    <div className="container">
      <div className="image-container">
        <img
          src="https://source.unsplash.com/960x520/?coffee,coffee"
          alt="Login"
          className="signin-image"
        />
      </div>
      <div className="signin-form-container">
        <form onSubmit={handleSubmit} className="signin-form">
          <Typography variant="body1" className="heading-l">
            Registration
          </Typography>
          <TextField
            name="name"
            label="Name"
            value={formData.name}
            onChange={handleValueChange}
            margin="normal"
            variant="outlined"
            className="signin-field"
            error={errors.name}
            helperText={errors.name}
          />
          <TextField
            name="email"
            label="Email"
            type="email"
            value={formData.email}
            onChange={handleValueChange}
            margin="normal"
            variant="outlined"
            className="signin-field"
            error={errors.email}
            helperText={errors.email}
          />
          <TextField
            name="password"
            label="Password"
            type="password"
            value={formData.password}
            onChange={handleValueChange}
            margin="normal"
            variant="outlined"
            className="signin-field"
            error={errors.password}
            helperText={errors.password}
          />
          <TextField
            name="confirmpassword"
            label="Confirm Password"
            type="password"
            value={formData.confirmpassword}
            onChange={handleValueChange}
            margin="normal"
            variant="outlined"
            className="signin-field"
            error={errors.confirmpassword}
            helperText={errors.confirmpassword}
          />
          {/* <TextField
            name="role"
            label="Role"
            value={formData.role}
            onChange={handleValueChange}
            margin="normal"
            variant="outlined"
            className="signin-field"
            error={errors.role}
            helperText={errors.role}
          /> */}
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disableElevation
            className="signin-button"
          >
            Sign Up
          </Button>
        </form>
      </div>
      
    </div>
  );
};

export default Signin;
