import { Box, IconButton, useTheme, Typography } from "@mui/material";
import { useContext } from "react";
import { ColorModeContext, tokens } from "../../theme";
import InputBase from "@mui/material/InputBase";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import SearchIcon from "@mui/icons-material/Search";
import { useAuth } from '../../context/AuthContext'; // Import your Auth context
import { Link } from 'react-router-dom'; // Import Link for navigation

const Topbar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);
  const { user } = useAuth(); // Get user info from Auth context

  // Assuming you have a way to get the current staff ID
  const staffId = user ? user._id : null; // Replace with actual logic to get the staff ID if available

  return (
    <Box display="flex" justifyContent="space-between" p={2}>
      {/* SEARCH BAR */}
      <Box display="flex" backgroundColor={colors.primary[400]} borderRadius="3px">
        <InputBase sx={{ ml: 2, flex: 1 }} placeholder="Search" />
        <IconButton type="button" sx={{ p: 1 }}>
          <SearchIcon />
        </IconButton>
      </Box>

      {/* ICONS */}
      <Box display="flex">
        <IconButton onClick={colorMode.toggleColorMode}>
          {theme.palette.mode === "dark" ? (
            <DarkModeOutlinedIcon />
          ) : (
            <LightModeOutlinedIcon />
          )}
        </IconButton>
        <IconButton>
          <NotificationsOutlinedIcon />
        </IconButton>
        <IconButton>
          <SettingsOutlinedIcon />
        </IconButton>

        {/* User Initial in a Link Box */}
        {staffId && ( // Only show link if staffId is available
          <Link to={`/updateStaff/${staffId}`} style={{ textDecoration: 'none' }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                backgroundColor: (colors.orange && colors.orange[500]) || '#ff9800', // Use orange color or fallback
                color: '#fff',
                fontWeight: 'bold',
                cursor: 'pointer',
                '&:hover': {
                  backgroundColor: (colors.orange && colors.orange[600]) || '#fb8c00', // Darker shade on hover
                },
              }}
            >
              <Typography variant="h6" sx={{ margin: 0 }}>
                {user.name.charAt(0).toUpperCase()} {/* Display first letter of user's name */}
              </Typography>
            </Box>
          </Link>
        )}
      </Box>
    </Box>
  );
};

export default Topbar;