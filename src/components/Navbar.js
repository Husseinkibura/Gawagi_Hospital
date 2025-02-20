// src/components/Navbar.js
import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  InputBase,
  Box,
  Badge,
  Menu,
  MenuItem,
  Avatar,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Search as SearchIcon,
  Settings as SettingsIcon,
  Notifications as NotificationsIcon,
  AccountCircle as ProfileIcon,
} from "@mui/icons-material";

const Navbar = ({ toggleSidebar, isSidebarOpen }) => {
  const [anchorElNotifications, setAnchorElNotifications] = useState(null);
  const [anchorElSettings, setAnchorElSettings] = useState(null);
  const [anchorElProfile, setAnchorElProfile] = useState(null);
  const [profileImage, setProfileImage] = useState(null);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    window.location.href = "/"; // Redirect to login page
  };

  const handleNotificationsClick = (event) => {
    setAnchorElNotifications(event.currentTarget);
  };

  const handleSettingsClick = (event) => {
    setAnchorElSettings(event.currentTarget);
  };

  const handleProfileClick = (event) => {
    setAnchorElProfile(event.currentTarget);
  };

  const handleCloseNotifications = () => {
    setAnchorElNotifications(null);
  };

  const handleCloseSettings = () => {
    setAnchorElSettings(null);
  };

  const handleCloseProfile = () => {
    setAnchorElProfile(null);
  };

  const handleProfileImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        backgroundColor: "white",
        color: "black",
        width: isSidebarOpen ? "calc(100% - 240px)" : "100%",
        marginLeft: isSidebarOpen ? "240px" : 0,
        zIndex: (theme) => theme.zIndex.drawer + 1,
        height: "56px",
        transition: "width 0.3s, margin-left 0.3s",
      }}
    >
      <Toolbar sx={{ minHeight: "56px !important", justifyContent: "space-between" }}>
        {/* Left-side (Toggle + Search Bar) */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          {/* Sidebar Toggle Button */}
          <IconButton color="inherit" edge="start" onClick={toggleSidebar} sx={{ p: "6px" }}>
            <MenuIcon />
          </IconButton>

          {/* Search Bar */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              backgroundColor: "#f5f5f5",
              borderRadius: "20px",
              padding: "4px 10px",
              width: "300px",
            }}
          >
            <SearchIcon sx={{ color: "gray", fontSize: "1.2rem" }} />
            <InputBase
              placeholder="Search..."
              sx={{ ml: 1, flex: 1, fontSize: "0.9rem" }}
            />
          </Box>
        </Box>

        {/* Right-side Icons */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          {/* Notifications */}
          <IconButton color="inherit" sx={{ p: "6px" }} onClick={handleNotificationsClick}>
            <Badge badgeContent={4} color="error" sx={{ "& .MuiBadge-badge": { fontSize: "0.65rem" } }}>
              <NotificationsIcon sx={{ fontSize: "1.1rem" }} />
            </Badge>
          </IconButton>
          <Menu
            anchorEl={anchorElNotifications}
            open={Boolean(anchorElNotifications)}
            onClose={handleCloseNotifications}
          >
            <MenuItem onClick={handleCloseNotifications}>Notification 1</MenuItem>
            <MenuItem onClick={handleCloseNotifications}>Notification 2</MenuItem>
            <MenuItem onClick={handleCloseNotifications}>Notification 3</MenuItem>
          </Menu>

          {/* Settings */}
          <IconButton color="inherit" sx={{ p: "6px" }} onClick={handleSettingsClick}>
            <SettingsIcon sx={{ fontSize: "1.1rem" }} />
          </IconButton>
          <Menu
            anchorEl={anchorElSettings}
            open={Boolean(anchorElSettings)}
            onClose={handleCloseSettings}
          >
            <MenuItem onClick={handleCloseSettings}>Profile</MenuItem>
            <MenuItem onClick={handleCloseSettings}>Settings</MenuItem>
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </Menu>

          {/* Profile */}
          <IconButton color="inherit" sx={{ p: "6px" }} onClick={handleProfileClick}>
            {profileImage ? (
              <Avatar src={profileImage} sx={{ width: 24, height: 24 }} />
            ) : (
              <ProfileIcon sx={{ fontSize: "1.1rem" }} />
            )}
          </IconButton>
          <Menu
            anchorEl={anchorElProfile}
            open={Boolean(anchorElProfile)}
            onClose={handleCloseProfile}
          >
            <MenuItem onClick={handleCloseProfile}>
              <label htmlFor="profile-image-upload" style={{ cursor: "pointer" }}>
                Upload Profile Image
              </label>
              <input
                id="profile-image-upload"
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={handleProfileImageUpload}
              />
            </MenuItem>
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;