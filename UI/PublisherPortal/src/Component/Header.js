import { Button } from "@mui/material";
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

function Header(props){
    function logout(){
        localStorage.clear();
        props.setCredentials(null);
       }
   
    return (    
    <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar variant="dense">
            <Typography variant="h6" color="inherit" component="div">
              Health Vault Publishers Portal
            </Typography>
            <Button variant="contained" sx={{ marginLeft: "auto" }} onClick={logout}>Logout</Button>
          </Toolbar>
        </AppBar>
      </Box>
    );

}

export default Header;