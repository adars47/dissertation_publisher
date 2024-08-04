import { Button } from "@mui/material";
import Grid from '@mui/material/Grid';
import { useState } from "react";
import axios from "axios";
import { FilePond,registerPlugin } from 'react-filepond';
import 'filepond/dist/filepond.min.css';
import FilePondPluginFileEncode from 'filepond-plugin-file-encode';

const EthCrypto = require('eth-crypto');
const CryptoJS = require("crypto-js");
registerPlugin(FilePondPluginFileEncode);


function UploadComponent(props){

const startUpload = async () => {
    const formData = new FormData();
    let count =0;
    let random_password = generatePassword();
    for(let medicalFile in medicalFiles['files'])
    {
        count++;
        let val = medicalFiles['files'][medicalFile];
        formData.append(
            "medical_"+val.name,
            val.file,
            val.name
        );
    }

    for(let personalFile in personalFiles['files'])
    {
        count++;
        let val = personalFiles['files'][personalFile];
        let encrypted = CryptoJS.AES.encrypt(val.getFileEncodeBase64String(),random_password).toString()
        let enc_blob = new Blob([encrypted],{type: val.type})
        val = val.file;
        formData.append(
            "personal_"+val.name,
            enc_blob,
            val.name
        );
    }

    if(count==0){
        alert("No files selected");
        return ;
    }

    formData.append("patient_pub_k",props.patient.publicKey);
    formData.append("doctor_account",props.patient.accountNumber);
    let credentials = JSON.parse(localStorage.getItem("credentials"));
    formData.append("doctor_pub_k",credentials.publicKey);
    formData.append("patient_account",credentials.accountNumber);
    formData.append("doctor_pri_k",credentials.privateKey);
    let url = "http://backend.local/submit";

    let signed_encryption_key = await EthCrypto.encryptWithPublicKey(props.patient.publicKey,random_password);
    const encryptedString = EthCrypto.cipher.stringify(signed_encryption_key);
    formData.append("signed_encryption_key",encryptedString);
    axios.post(url,formData)
    .then((response)=>{
        if(response.status === 200){
            alert("Transaction Concluded: Transaction id "+response.data);
            props.setPatient(undefined);
            setPersonalFiles([]);
            setMedicalFiles([]);        
        }
        else
        {
            alert("Failed to upload");
        }
    });
}

function generatePassword() {
    var length = 16,
        charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
        retVal = "";
    for (var i = 0, n = charset.length; i < length; ++i) {
        retVal += charset.charAt(Math.floor(Math.random() * n));
    }
    return retVal;
}

const restartProcess = () =>{
    props.setPatient(undefined);
    setPersonalFiles([]);
    setMedicalFiles([]);
}
const [personalFiles,setPersonalFiles] = useState({});
const [medicalFiles,setMedicalFiles] = useState({});

return (
    <div>
        <h1>Upload Files</h1>
        <Button variant="contained" onClick={restartProcess}>Restart Process</Button>
        <Grid container xs={12}>
            <Grid item xs={6}>
                <h1>Personal Files</h1>
                <div style={{margin:50}}>
                    <FilePond allowMultiple={true} onupdatefiles={(fileItems) => {
                        setPersonalFiles({
                            files: fileItems.map((fileItem) => fileItem),
                        })
                    }}
></FilePond>
                </div>
            </Grid>
            <Grid item xs={6}>
                <h1>Healthcare Files</h1>
                    <div style={{margin:50}}>
                        <FilePond allowMultiple={true} allowFileEncode={true} onupdatefiles={(fileItems) => {
                        setMedicalFiles({
                            files: fileItems.map((fileItem) => fileItem),
                        })
                    }} ></FilePond>
                    </div>
            </Grid>
        </Grid>
        <Button variant="contained" sx={{marginTop:2}} onClick={startUpload}>Upload</Button>
    </div>
);
}

export default UploadComponent