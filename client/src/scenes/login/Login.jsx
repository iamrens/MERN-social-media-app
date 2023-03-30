import { Box, Typography, useTheme, useMediaQuery } from "@mui/material";
import Forms from "./Forms";

const Login = () => {
  const theme = useTheme();
  const isNonMobileScreens = useMediaQuery("(min-width: 960px)");

  return (
    <Box>
      <Box
        width="100%"
        backgroundColor={theme.palette.background.alt}
        p="1rem 6%"
        textAlign="center"
      >
        <Typography fontWeight="bold" fontSize="32px" color="primary">
          FriendZone
        </Typography>
      </Box>

      <Box
        width={isNonMobileScreens ? "50%" : "90%"}
        p="2rem"
        m="2rem auto"
        borderRadius="1.5rem"
        backgroundColor={theme.palette.background.alt}
        textAlign="center"
      >
        <Typography fontWeight="500" variant="h5" sx={{mb: '1.5rem'}}>
          Welcome to FriendZone, the place to connect, share, and build meaningful relationships with FRIENDS.
        </Typography>
        <Forms />
      </Box>
    </Box>
  )
}

export default Login