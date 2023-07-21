import React from "react";
import { Typography, IconButton } from "@mui/material";
import { FaFacebook, FaTwitter, FaInstagram } from "react-icons/fa";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="column-1">
        <Typography variant="h4" className="title">
          Drink Kings
        </Typography>
        <div>
          <div className="cl-1">
            <Link
              className="text"
              to="/"
              style={{ textDecoration: "none", color: "inherit" }}
            >
              About Us
            </Link>
            <Link
              className="text"
              to="/"
              style={{ textDecoration: "none", color: "inherit" }}
            >
              Contact Us
            </Link>
            <Link
              className="text"
              to="/"
              style={{ textDecoration: "none", color: "inherit" }}
            >
              Help Desk
            </Link>
          </div>
        </div>
        <div className="column-2">
          <Typography variant="body2" className="text-s">
            SOCIAL MEDIA
          </Typography>
          <div className="s-icon">
            <IconButton className="social-icon" aria-label="Facebook">
              <FaFacebook />
            </IconButton>
            <IconButton className="social-icon" aria-label="Twitter">
              <FaTwitter />
            </IconButton>
            <IconButton className="social-icon" aria-label="Instagram">
              <FaInstagram />
            </IconButton>
          </div>
        </div>
      </div>
      <div className="copy-r">
        <Typography variant="body2" align="center" className="Text-copy">
          &copy; {new Date().getFullYear()} Drink Kings
        </Typography>
      </div>
    </footer>
  );
};

export default Footer;
