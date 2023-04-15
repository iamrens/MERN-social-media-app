import { Box, Typography, useTheme } from "@mui/material"
import { useNavigate } from "react-router-dom";

const SearchList = ({ firstName, lastName, searchId }) => {

    const navigate = useNavigate();
    const { palette } = useTheme();

    return (
        <Box
            onClick={() => {
                navigate(`/profile/${searchId}`);
                navigate(0);
            }}
        >
            <Typography 
            sx={{
                cursor: 'pointer', 
                p: 1, 
                '&:hover': {bgcolor: palette.background.alt, borderRadius: '9px'},
            }}>
                {`${firstName} ${lastName}`}
            </Typography>
        </Box>
    )
}

export default SearchList