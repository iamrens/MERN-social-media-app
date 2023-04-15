import { Box, Button, Typography } from '@mui/material';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '70vh',
        borderRadius: 5,
        mx: 2,
      }}
    >
      <Typography
        variant="h1"
        sx={{ fontSize: '4rem', fontWeight: 'bold', marginBottom: '1rem' }}
      >
        404
      </Typography>
      <Typography
        variant="h2"
        sx={{ fontSize: '1.5rem', mb: '2rem' }}
      >
        Page could not be found.
      </Typography>
      <Link to="/home">
        <Button
          variant="contained"
          sx={{
            backgroundColor: '#1976d2',
            color: '#fff',
            '&:hover': {
              backgroundColor: '#115293',
            },
          }}
        >
          Go to Home Page
        </Button>
      </Link>
    </Box>
  )
}

export default NotFound