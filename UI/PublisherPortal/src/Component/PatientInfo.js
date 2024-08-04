import { Typography, Box, Container, Button, TextField } from "@mui/material";

function PatientInfo(props){

    const savepatientKey = (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        let patient = {
            publicKey: data.get('publicKey').trim(),
            accountNumber: data.get('accountNumber').trim()
        }
        console.log(patient);
        localStorage.setItem("patient",patient);
        props.setPatient(patient);    
    };

    return (
    <Container component="main" maxWidth="xs">
        <Box
        component="form" 
        onSubmit={savepatientKey}
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
            <Typography variant="h6" color="inherit" component="div">
              Please input patient's public key 
            </Typography>
            <TextField
                id="publicKey"
                name="publicKey"
                label="Patient Public Key"
                sx={{ padding: 1}}
            />
            <TextField
                id="accountNumber"
                name="accountNumber"
                label="Patient Account Number"
                sx={{ padding: 1}}
            />
            <Button variant="contained" type="submit">Start Process</Button>
        </Box>
    </Container>
    );
}

export default PatientInfo;