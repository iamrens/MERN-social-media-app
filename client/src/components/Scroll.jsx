import { IconButton, useTheme } from "@mui/material";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

const Scroll = () => {
    const { palette } = useTheme();
    const bg = palette.neutral.medium;

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
            bgcolor: bg,
            opacity: 0.5,
            '&:hover': {
                opacity: 1
            }
        }}
        >
            <KeyboardArrowUpIcon />
        </IconButton>
    );
};

export default Scroll;
