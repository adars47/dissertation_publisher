import { base64StringToBlob } from 'blob-util';
import alertify from 'alertifyjs';
import 'alertifyjs/build/css/alertify.css';

const CryptoJS = require("crypto-js");

const decryptAndDownload = async (blob,filename,decryption_key) => {
    let blob_str = await blob.text();
    let dec = await CryptoJS.AES.decrypt(blob_str,decryption_key).toString(CryptoJS.enc.Utf8);
    if(!dec)
    {
        alertify.error("Invalid private key supplied");
    }
    blob = base64StringToBlob(dec,blob.type);
    var csvURL = window.URL.createObjectURL(blob);
    let tempLink = document.createElement('a');
    tempLink.href = csvURL;
    tempLink.setAttribute('download', filename);
    tempLink.click();
};

export default decryptAndDownload;