import { useState } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Alert from '@mui/material/Alert';

const defaultTheme = createTheme();


export default function SignIn(props) {

  const [alert, setAlert] = useState(null);
  const credentials= props.credentials;
  const setCredentials =  props.setCredentials;

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    let credential = {
        publicKey: data.get('publicKey').trim(),
        privateKey: data.get('privateKey').trim(),
        accountNumber: data.get('accountNumber').trim()
      };

    if(credentials === false || credential.privateKey=="" || credential.publicKey==""){
        setAlert(<Alert severity="error">You must insert a valid private and public key!</Alert>);
        setTimeout(function(){
            setAlert(null);
        },10000);
    }else
    {
      localStorage.setItem("credentials",JSON.stringify(credential));
      setCredentials(credential);
    }
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      {alert}
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Decentralized Health Vault
          </Typography>
          <Typography component="h1" variant="h5">
            Publisher's portal
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="publicKey"
              label="Public Key"
              name="publicKey"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="privateKey"
              label="Private Key"
              type="password"
              id="privateKey"
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="accountNumber"
              label="Account Number"
              id="accountNumber"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}