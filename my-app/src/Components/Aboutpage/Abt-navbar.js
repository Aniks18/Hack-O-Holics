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

const AbtNavbar = ({ triggerPopup }) => {
  const [openMenu, setOpenMenu] = useState(false);

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
    <nav>
      <a href="/" onClick={triggerPopup}>
        <div className="nav-logo-container">
          <img src={Logo} alt="Logo" />
        </div>
      </a>

      <div className="navbar-links-container">
        <a href="/">Home</a>
        <a href="#mission">Mission & Vision</a>
        <a href="#story">Our story</a>
        <a href="#case-study">Case Study</a>

        <Link to="/login">
          <button className="primary-button">Login</button>
        </Link>
      </div>

      <div className="navbar-menu-container">
        <HiOutlineBars3 onClick={() => setOpenMenu(true)} />
      </div>

      <Drawer open={openMenu} onClose={() => setOpenMenu(false)} anchor="right">
        <Box
          sx={{ width: 250 }}
          role="presentation"
          onClick={() => setOpenMenu(false)}
          onKeyDown={() => setOpenMenu(false)}
        >
          <List>
            {menuOptions.map((item) => (
              <ListItem key={item.text} disablePadding>
                <Link
                  to={item.path}
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <ListItemButton>
                    <ListItemIcon>{item.icon}</ListItemIcon>
                    <ListItemText primary={item.text} />
                  </ListItemButton>
                </Link>
              </ListItem>
            ))}
          </List>
          <Divider />
        </Box>
      </Drawer>
    </nav>
  );
};

export default AbtNavbar;
