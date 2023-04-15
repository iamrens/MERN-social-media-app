import { IconButton, useTheme } from "@mui/material";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

const Scroll = () => {
    const { palette } = useTheme();

    const handleClick = () => {
        window.scrollTo({
        top: 0,
        behavior: "smooth",
        });
    };

    return (
        <IconButton
        aria-label="scroll to top"
        onClick={handleClick}
        sx={{
            position: "fixed",
            bottom: "0.3rem",
            right: "0.3rem",
            bgcolor: palette.primary.light,
            border: `1px solid ${palette.primary.main}`,
            opacity: 0.5,
            '&:hover': {
                opacity: 1,
                bgcolor: palette.primary.light,
            }
        }}
        >
            <KeyboardArrowUpIcon sx={{color: palette.primary.main}}/>
        </IconButton>
    );
};

export default Scroll;
