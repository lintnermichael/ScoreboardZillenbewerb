import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import '../App.css'

function TopBar() {
return (
    <Box sx={{ flexGrow: 1, width: '100vw', marginLeft: 'calc(-50vw + 50%)' }}>
            <AppBar position="fixed" sx={{ width: '100vw', left: 0, top: 0 }}>
                <Toolbar>
                    <Typography variant="h6" component="div">
                        ZillenDOC
                    </Typography>
                </Toolbar>
            </AppBar>
        </Box>
)
}

export default TopBar;
