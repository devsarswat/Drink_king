import React, { useContext, useState,useRef,useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import { Acontext } from "../App";
import {
  BsPersonFill,
  BsCart4,
  BsGearFill,
  BsBoxArrowRight,
  BsBoxSeam,
  BsChevronDown,
} from "react-icons/bs";
import profileIcon from "../Images/account_thin.svg";

const Navbar = () => {
  const { isLogin, setisLogin, user, setuser } = useContext(Acontext);
  const { search, setSearch } = useContext(Acontext);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };
  const handlelogot = () => {
    setIsDropdownOpen(!isDropdownOpen);
    setisLogin(localStorage.removeItem("userid"));
    setuser(null);
  };
  const dropdownRef = useRef(null);
  const closeDropdown = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsDropdownOpen(false);
    }
  };
  useEffect(() => {
    document.addEventListener("click", closeDropdown);

    return () => {
      document.removeEventListener("click", closeDropdown);
    };
  }, []);

  return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary ms-auto mb-2 mb-lg-0">
      <div className="container-fluid">
        <Link className="navbar-brand mx-4" to="/">
          Drink Kings
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item mx-2">
              <NavLink className="nav-link" aria-current="page" to="/">
                Home
              </NavLink>
            </li>
            <li className="nav-item mx-2">
              <NavLink className="nav-link" aria-current="page" to="/alldata">
                Product
              </NavLink>
            </li>
          </ul>
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
            <li className="nav-item mx-2">
              <input
                type="text"
                placeholder="Search"
                value={search}
                onChange={handleSearchChange}
                className="form-control"
              />
            </li>
            <li className="nav-item mx-2" ref={dropdownRef}>
            <div>
              <button
                className="btn btn-link nav-link"
                onClick={toggleDropdown}
              >
                {isLogin && (
                  <strong className="user-name">
                    {user.name} <BsChevronDown />
                  </strong>
                )}
                {user && user.image ? (
                  <img
                    src={user.image}
                    alt="Profile"
                    className="profile-icon-i"
                  />
                ) : (
                  <img
                    src={profileIcon}
                    alt="Profile Icon"
                    className="profile-icon profile-icon-i"
                  />
                )}
              </button>

              {isDropdownOpen && (
                <ul className="dropdown-menu dropdown-menu-start show">
                  <li>
                    <Link
                      className="dropdown-item"
                      to="/profile"
                      onClick={toggleDropdown}
                    >
                      <BsPersonFill className="me-2" /> Profile
                    </Link>
                  </li>
                  <li>
                    <Link
                      className="dropdown-item"
                      to="/cart"
                      onClick={toggleDropdown}
                    >
                      <BsCart4 className="me-2" /> Cart
                    </Link>
                  </li>

                  {isLogin && (
                    <>
                      <li>
                        <Link
                          className="dropdown-item"
                          to="/order"
                          onClick={toggleDropdown}
                        >
                          <BsBoxSeam className="me-2" /> Order
                        </Link>
                      </li>
                      <li>
                        <Link
                          className="dropdown-item"
                          to="/setting"
                          onClick={toggleDropdown}
                        >
                          <BsGearFill className="me-2" /> Settings
                        </Link>
                      </li>
                      <li>
                        <Link
                          className="dropdown-item"
                          to="/"
                          onClick={handlelogot}
                        >
                          <BsBoxArrowRight className="me-2" /> Logout
                        </Link>
                      </li>
                    </>
                  )}
                  {!isLogin && (
                    <li>
                      <Link
                        className="dropdown-item"
                        to="/login"
                        onClick={handlelogot}
                      >
                        <BsBoxArrowRight className="me-2" /> Login
                      </Link>
                    </li>
                  )}
                </ul>
              )}
              </div>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
