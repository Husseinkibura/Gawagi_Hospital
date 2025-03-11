import React, { useState, useEffect } from "react";
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
  useMediaQuery,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Search as SearchIcon,
  Settings as SettingsIcon,
  Notifications as NotificationsIcon,
  AccountCircle as ProfileIcon,
} from "@mui/icons-material";
import { toast } from "react-toastify";

const Navbar = ({ toggleSidebar, isSidebarOpen }) => {
  const isMobile = useMediaQuery("(max-width: 600px)");
  const [anchorElNotifications, setAnchorElNotifications] = useState(null);
  const [anchorElSettings, setAnchorElSettings] = useState(null);
  const [anchorElProfile, setAnchorElProfile] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const [notifications, setNotifications] = useState([]);

  // Fetch notifications from the backend
  const fetchNotifications = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/notifications");
      if (!response.ok) {
        throw new Error("Failed to fetch notifications");
      }
      const data = await response.json();
      setNotifications(data);
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Mark a notification as read
  const markNotificationAsRead = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/notifications/${id}/read`,
        {
          method: "PUT",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to mark notification as read");
      }

      // Update the notification status locally
      setNotifications((prevNotifications) =>
        prevNotifications.map((notification) =>
          notification.id === id
            ? { ...notification, status: "Read" }
            : notification
        )
      );

      toast.success("Notification marked as read");
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Fetch notifications on component mount
  useEffect(() => {
    fetchNotifications();
  }, []);

  // Handle notifications menu click
  const handleNotificationsClick = (event) => {
    setAnchorElNotifications(event.currentTarget);
  };

  // Handle close notifications menu
  const handleCloseNotifications = () => {
    setAnchorElNotifications(null);
  };

  // Handle settings menu click
  const handleSettingsClick = (event) => {
    setAnchorElSettings(event.currentTarget);
  };

  // Handle close settings menu
  const handleCloseSettings = () => {
    setAnchorElSettings(null);
  };

  // Handle profile menu click
  const handleProfileClick = (event) => {
    setAnchorElProfile(event.currentTarget);
  };

  // Handle close profile menu
  const handleCloseProfile = () => {
    setAnchorElProfile(null);
  };

  // Handle profile image upload
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

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    window.location.href = "/login"; // Redirect to login page
  };

  // Count unread notifications
  const unreadNotificationsCount = notifications.filter(
    (notification) => notification.status === "Unread"
  ).length;

  return (
    <AppBar
      position="fixed"
      sx={{
        backgroundColor: "white",
        color: "black",
        width: isSidebarOpen ? { xs: "100%", sm: `calc(100% - ${isMobile ? "0px" : "240px"})` } : "100%",
        marginLeft: isSidebarOpen && !isMobile ? "240px" : 0,
        zIndex: (theme) => theme.zIndex.drawer + 1,
        height: "56px",
        transition: "width 0.3s, margin-left 0.3s",
      }}
    >
      <Toolbar
        sx={{
          minHeight: "56px !important",
          justifyContent: "space-between",
        }}
      >
        {/* Left-side (Toggle + Search Bar) */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          {/* Sidebar Toggle Button */}
          <IconButton
            color="inherit"
            edge="start"
            onClick={toggleSidebar}
            sx={{ p: "6px" }}
          >
            <MenuIcon />
          </IconButton>

          {/* Search Bar */}
          {!isMobile && (
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
          )}
        </Box>

        {/* Right-side Icons */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          {/* Notifications */}
          <IconButton
            color="inherit"
            sx={{ p: "6px" }}
            onClick={handleNotificationsClick}
          >
            <Badge
              badgeContent={unreadNotificationsCount}
              color="error"
              sx={{ "& .MuiBadge-badge": { fontSize: "0.65rem" } }}
            >
              <NotificationsIcon sx={{ fontSize: "1.1rem" }} />
            </Badge>
          </IconButton>
          <Menu
            anchorEl={anchorElNotifications}
            open={Boolean(anchorElNotifications)}
            onClose={handleCloseNotifications}
          >
            {notifications.map((notification) => (
              <MenuItem
                key={notification.id}
                onClick={() => {
                  if (notification.status === "Unread") {
                    markNotificationAsRead(notification.id);
                  }
                  handleCloseNotifications();
                }}
                sx={{
                  backgroundColor:
                    notification.status === "Unread" ? "#e3f2fd" : "inherit",
                }}
              >
                <Box>
                  <p className="text-sm font-medium text-gray-700">
                    {notification.message}
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(notification.created_at).toLocaleString()}
                  </p>
                </Box>
              </MenuItem>
            ))}
          </Menu>

          {/* Settings */}
          <IconButton
            color="inherit"
            sx={{ p: "6px" }}
            onClick={handleSettingsClick}
          >
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
          <IconButton
            color="inherit"
            sx={{ p: "6px" }}
            onClick={handleProfileClick}
          >
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
              <label
                htmlFor="profile-image-upload"
                style={{ cursor: "pointer" }}
              >
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