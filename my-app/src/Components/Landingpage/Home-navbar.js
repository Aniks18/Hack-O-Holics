import React, { useState } from "react";
import { Link } from "react-router-dom";
import Logo from "../../Assets/Logo.svg";
import { HiOutlineBars3 } from "react-icons/hi2";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import HomeIcon from "@mui/icons-material/Home";
import InfoIcon from "@mui/icons-material/Info";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import PhoneRoundedIcon from "@mui/icons-material/PhoneRounded";
import LoginIcon from "@mui/icons-material/Login";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import LoginForm from "../Common/LoginForm";

const Navbar = ({ triggerPopup }) => {
  const [openMenu, setOpenMenu] = useState(false);
  const [language, setLanguage] = useState("English");
  const [showLogin, setShowLogin] = useState(false);

  const handleLanguageChange = (event) => {
    setLanguage(event.target.value);
  };
  const handleLoginClick = () => {
    setShowLogin(true); // Show the Login component when the button is clicked
  };
  const closeLogin = () => {
    setShowLogin(false); // Close the Login component
  };

  const menuOptions = [
    {
      text: "Home",
      icon: <HomeIcon />,
      path: "/",
    },
    {
      text: "About",
      icon: <InfoIcon />,
      path: "/about",
    },
    {
      text: "Grievance Portal",
      icon: <ReportProblemIcon />,
      path: "/grievance", // Example path
    },
    {
      text: "Contact",
      icon: <PhoneRoundedIcon />,
      path: "/contact", // Example path
    },
    {
      text: "Login",
      icon: <LoginIcon />,
      path: "/login", // Example path
    },
  ];

  return (
    <>
      <nav>
        <a href="/" onClick={triggerPopup}>
          <div className="nav-logo-container">
            <img src={Logo} alt="Logo" />
          </div>
        </a>

        <div className="navbar-links-container">
          <a href="#about-section">About</a>
          <a href="/">Grievance Portal</a>
          <a href="#contact-section">Contact</a>

          {/* Language Dropdown */}
          <FormControl
            variant="standard"
            sx={{ minWidth: 120, marginRight: 2 }}
          >
            <Select
              value={language}
              onChange={handleLanguageChange}
              displayEmpty
              inputProps={{ "aria-label": "Select Language" }}
            >
              <MenuItem value="English">English</MenuItem>
              <MenuItem value="Hindi">Hindi</MenuItem>
              <MenuItem value="Tamil">Tamil</MenuItem>
              <MenuItem value="Telugu">Telugu</MenuItem>
            </Select>
          </FormControl>

          <button className="primary-button" onClick={handleLoginClick}>
            Login
          </button>
        </div>

        <div className="navbar-menu-container">
          <HiOutlineBars3 onClick={() => setOpenMenu(true)} />
        </div>

        <Drawer
          open={openMenu}
          onClose={() => setOpenMenu(false)}
          anchor="right"
        >
          <Box
            sx={{ width: 250 }}
            role="presentation"
            onClick={() => setOpenMenu(false)}
            onKeyDown={() => setOpenMenu(false)}
          >
            <List>
              {menuOptions.map((item, index) => (
                <ListItem key={index} disablePadding>
                  <ListItemButton
                    component={Link}
                    to={item.path}
                    onClick={
                      item.text === "Login" ? handleLoginClick : undefined
                    }
                  >
                    <ListItemIcon>{item.icon}</ListItemIcon>
                    <ListItemText primary={item.text} />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
            <Divider />
          </Box>
        </Drawer>
      </nav>
      {showLogin && <LoginForm isVisible={showLogin} onClose={closeLogin} />}
    </>
  );
};

export default Navbar;