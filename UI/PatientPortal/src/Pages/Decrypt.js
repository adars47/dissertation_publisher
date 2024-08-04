import { FilePond,registerPlugin } from 'react-filepond';
import 'filepond/dist/filepond.min.css';
import FilePondPluginFileEncode from 'filepond-plugin-file-encode';
import { useState } from "react";
import { Typography, Box, Container, Button, TextField } from "@mui/material";
import WebComponent from '../Components/Web3Component';
registerPlugin(FilePondPluginFileEncode);



function Decrypt(){
    const [transactionId,setTransactionId] = useState("");
    const [decryptionKey,setdecryptionKey] = useState("");
    

    const savepatientKey = async (event) =>
    {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        let patient_private_key = data.get('private_key').trim();
        let signed_encryption_key = data.get('signed_encryption_key').trim();
        if(patient_private_key === "" || patient_private_key == undefined || patient_private_key === null)
        {
            return ;
        }
        if(signed_encryption_key === "" || signed_encryption_key == undefined || signed_encryption_key === null)
        {
            return ;
        }
        setTransactionId(signed_encryption_key);
        setdecryptionKey(patient_private_key);
    }


    
    return (<div>
        <WebComponent transactionId={transactionId} decryption_key={decryptionKey}/>
        <Typography variant="h3" color="inherit" component="div" align='center'>
                Patient Decryption Portal 
        </Typography>
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
                Please input the patient's private key 
                </Typography>
                <TextField
                    id="private_key"
                    name="private_key"
                    label="Patient private Key"
                    sx={{ padding: 1}}
                />

<Typography variant="h6" color="inherit" component="div">
                Please input the transaction ID 
                </Typography>
                <TextField
                    id="signed_encryption_key"
                    name="signed_encryption_key"
                    label="Transaction id"
                    sx={{ padding: 1}}
                />
                <Button variant="contained" type="submit">Decrypt</Button>
        </Box>
    </Container>
    </div>)
}

export default Decrypt;