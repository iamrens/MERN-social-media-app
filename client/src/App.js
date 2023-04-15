import { BrowserRouter, Navigate, Routes, Route } from "react-router-dom";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { themeSettings } from "./theme";
import Login from "./scenes/login/Login";
import Homepage from "./scenes/Homepage";
import Profile from "./scenes/Profile";
import Scroll from "./components/Scroll";
import MySnackbar from "./components/MySnackbar";
import NotFound from "./scenes/NotFound";

function App() {
  const mode = useSelector((state) => state.mode);
  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);
  const isAuth = Boolean(useSelector((state) => state.token));

  return (
    <div className="app">
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Scroll />
          <Routes>
            <Route path="/" element={ <Login /> } />
            <Route path="/home" element={ isAuth ? <Homepage /> : <Navigate to="/" /> }/>
            <Route path="/profile/:userId" element={ isAuth ? <Profile /> : <Navigate to="/" /> } />
            <Route path="*" element={ <NotFound /> } />
          </Routes>
          <MySnackbar />
        </ThemeProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
