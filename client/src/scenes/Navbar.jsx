import { useState } from "react";
import { Box, IconButton, InputBase, Typography, Select, MenuItem, FormControl, useTheme, useMediaQuery, Tooltip, Divider, CircularProgress } from "@mui/material";
import { Search, Message, DarkMode, LightMode, Notifications, Help, Menu, Close, SearchOff } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { setMode, setLogout } from "../state";
import { useNavigate } from "react-router-dom";
import FlexBetween from "../components/FlexBetween";
import axios from "axios";
import SearchList from "../components/Search";

const dbApi = process.env.REACT_APP_DB_API;

const Navbar = () => {
    const [isMobileMenuToggled, setIsMobileMenuToggled] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const user = useSelector((state) => state.user);
    const token = useSelector((state) => state.token);
    const isNonMobileScreens = useMediaQuery("(min-width: 960px)");
    const smScreens = useMediaQuery("(min-width: 500px)");
    const [searchTerm, setSearchTerm] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [openSearch, setOpenSearch] = useState(null);
    const [openSearchBar, setOpenSearchBar] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const theme = useTheme();
    const neutralLight = theme.palette.neutral.light;
    const dark = theme.palette.neutral.dark;
    const background = theme.palette.background.default;
    const primaryLight = theme.palette.primary.light;
    const alt = theme.palette.background.alt;

    const fullName = `${user?.firstName} ${user?.lastName}`;

    
    const handleSearch = async () => {
      if (!searchTerm.trim()) {
        return;
      }
      // console.log(searchTerm)
      setIsLoading(true)
      try {
        const response = await axios.get(`${dbApi}/users/search?searchTerm=${encodeURIComponent(searchTerm)}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        // console.log(response.data)
        setSearchResults(response.data)
        setOpenSearch(true)
        setSearchTerm("")
      } catch (err) {
        console.error(err, err.response.data.message);
      } finally {
        setIsLoading(false);
      }
    };

    return (
        <FlexBetween padding="1rem 5%" backgroundColor={alt}>
          <FlexBetween gap={smScreens ? '1.75rem' : '1rem'}>
            <Typography
              fontWeight="bold"
              fontSize="clamp(1rem, 2rem, 2.25rem)"
              color="primary"
              onClick={() => navigate("/home")}
              sx={{
                "&:hover": {
                  color: primaryLight,
                  cursor: "pointer",
                },
              }}
            >
              FriendZone
            </Typography>
            <Box sx={{display: 'flex', alignItems: 'center', flexDirection: 'column'}}>
            { smScreens ? 
              <FlexBetween
                backgroundColor={neutralLight}
                borderRadius="9px"
                gap="2rem"
                padding="0.1rem 1.5rem"
              >
                <InputBase 
                  placeholder="Search user..." 
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                />
                <Box>
                  <IconButton disabled={isLoading} onClick={handleSearch}>
                    {isLoading ? <CircularProgress size={24} color="primary" /> : <Search />}
                  </IconButton>
                </Box>
              </FlexBetween> 
              :
              <Box>
                <IconButton onClick={() => {
                  setOpenSearchBar(openSearchBar => !openSearchBar);
                  setOpenSearch(false);
                }}>
                  {openSearchBar ? <SearchOff /> : <Search />}
                </IconButton>
                {openSearchBar &&
                  <FlexBetween 
                    sx={{
                      position: 'absolute', 
                      left: '15%', 
                      bgcolor: neutralLight, 
                      width: '60vw', 
                      mt: 2, 
                      borderRadius: '9px',
                      px: 1.5,
                      py: 1,
                      }}
                    >
                      <InputBase 
                        placeholder="Search user..." 
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                      />
                      <IconButton disabled={isLoading} onClick={handleSearch}>
                        {isLoading ? <CircularProgress size={24} color="primary" /> : <Search />}
                      </IconButton>
                    
                  </FlexBetween>
                }
              </Box>
            }
            {openSearch &&
                <Box sx={{width: '100%', position: smScreens ? 'relative' : 'none'}}>
                <Box 
                  sx={{
                    bgcolor: theme.palette.neutral.light, 
                    mt: 2, 
                    p: '0.5rem 1rem', 
                    borderRadius: '9px', 
                    position: 'absolute',
                    left: smScreens ? null : '15%',
                    top: smScreens ? null : '19%',
                    width: smScreens ? '100%' : '60vw',
                    display: 'flex',
                    flexDirection: 'column',
                    zIndex: 10,
                    boxShadow: `0px 0px 4px white`
                  }}
                >
                  <FlexBetween>
                    <Typography>Search Results...</Typography>
                    {/* <IconButton onClick={() => setOpenSearch(null)}> */}
                    <IconButton onClick={() => {
                      setOpenSearch(openSearch => !openSearch);
                      setOpenSearchBar(false);
                    }}>
                      <Close />
                    </IconButton>
                  </FlexBetween>
                  <Divider />
                  <Box pt={1}>
                    {searchResults.length > 0 ? (
                      searchResults.map((result) => (
                        <SearchList 
                          key={result._id} 
                          firstName={result.firstName} 
                          lastName={result.lastName} 
                          searchId={result._id} 
                        />
                      ))
                    ) : (
                      <Typography variant="body2" >No user with that name.</Typography>
                    )}
                  </Box>
                </Box>
              </Box>}
              </Box>
          </FlexBetween>
    
          {/* DESKTOP NAV */}
          {isNonMobileScreens ? (
            <FlexBetween gap={isNonMobileScreens ? "1rem" : "0.5rem"}>
              <Tooltip title="Dark/Light mode" placement="top">
                <IconButton onClick={() => dispatch(setMode())}>
                  {theme.palette.mode === "dark" ? (
                    <DarkMode sx={{ fontSize: "25px" }} />
                  ) : (
                    <LightMode sx={{ color: dark, fontSize: "25px" }} />
                  )}
                </IconButton>
              </Tooltip>
              <Tooltip title="In development" placement="top">
                <IconButton>
                  <Message sx={{ fontSize: "25px" }} />
                </IconButton>
              </Tooltip>
              <Tooltip title="In development" placement="top">
                <IconButton>
                  <Notifications sx={{ fontSize: "25px" }} />
                </IconButton>
              </Tooltip>
              <Tooltip title="In development" placement="top">
                <IconButton>
                  <Help sx={{ fontSize: "25px" }} />
                </IconButton>
              </Tooltip>
              <FormControl variant="standard" value={fullName}>
                <Select
                  value={fullName}
                  sx={{
                    backgroundColor: neutralLight,
                    width: "100%",
                    borderRadius: "0.25rem",
                    p: "0.25rem 1rem",
                    "& .MuiSvgIcon-root": {
                      pr: "0.25rem",
                      width: "3rem",
                    },
                    "& .MuiSelect-select:focus": {
                      backgroundColor: neutralLight,
                    },
                  }}
                  input={<InputBase />}
                >
                  <MenuItem value={fullName}>
                    <Typography>{fullName}</Typography>
                  </MenuItem>
                  <MenuItem onClick={() => dispatch(setLogout())}>Log Out</MenuItem>
                </Select>
              </FormControl>
            </FlexBetween>
          ) : (
            <Box>
            {/* <Typography>Menu</Typography> */}
            <Tooltip title="Menu" placement="top">
            
            <IconButton
              onClick={() => setIsMobileMenuToggled(!isMobileMenuToggled)}
            >
              <Menu />
            </IconButton>
            </Tooltip>
            </Box>
          )}
    
          {/* MOBILE NAV */}
          {!isNonMobileScreens && isMobileMenuToggled && (
            <Box
              position="fixed"
              right="0"
              top="0"
              height="100%"
              zIndex="10"
              maxWidth="500px"
              // minWidth="300px"
              minWidth="10%"
              backgroundColor={background}
            >
              {/* CLOSE ICON */}
              <Box display="flex" justifyContent="flex-end" p="0.5rem">
                <IconButton
                  onClick={() => setIsMobileMenuToggled(!isMobileMenuToggled)}
                >
                  <Close />
                </IconButton>
              </Box>
    
              {/* MENU ITEMS */}
              <FlexBetween
                display="flex"
                flexDirection="column"
                justifyContent="space-between"
                alignItems="center"
                gap="1rem"
                p="0.5rem"
              >
                <Box display="flex" justifyContent="space-evenly" width="100%">
                  <Tooltip title="Dark/Light mode" placement="top">
                  <IconButton
                    onClick={() => dispatch(setMode())}
                    sx={{ fontSize: "25px" }}
                  >
                    {theme.palette.mode === "dark" ? (
                      <DarkMode sx={{ fontSize: "25px" }} />
                    ) : (
                      <LightMode sx={{ color: dark, fontSize: "25px" }} />
                    )}
                  </IconButton>
                  </Tooltip>
                  <Tooltip title="In development" placement="top">
                  <IconButton>
                    <Message sx={{ fontSize: "25px" }} />
                  </IconButton>
                  </Tooltip>
                </Box>
                <Box display="flex" justifyContent="space-evenly" width="100%">
                  <Tooltip title="In development" placement="top">
                  <IconButton>
                    <Notifications sx={{ fontSize: "25px" }} />
                  </IconButton>
                  </Tooltip>
                  <Tooltip title="In development" placement="top">
                  <IconButton>
                    <Help sx={{ fontSize: "25px" }} />
                  </IconButton>
                  </Tooltip>
                </Box>
                <FormControl variant="standard" value={fullName}>
                  <Select
                    value={fullName}
                    sx={{
                      backgroundColor: neutralLight,
                      width: "100%",
                      borderRadius: "0.25rem",
                      p: "0.25rem 1rem",
                      "& .MuiSvgIcon-root": {
                        // pr: "0.25rem",
                        width: "3rem",
                      },
                      "& .MuiSelect-select:focus": {
                        backgroundColor: neutralLight,
                      },
                    }}
                    input={<InputBase />}
                  >
                    <MenuItem value={fullName}>
                      <Typography>{fullName}</Typography>
                    </MenuItem>
                    <MenuItem onClick={() => dispatch(setLogout())}>
                      Log Out
                    </MenuItem>
                  </Select>
                </FormControl>
              </FlexBetween>
            </Box>
          )}
        </FlexBetween>
      );
}

export default Navbar