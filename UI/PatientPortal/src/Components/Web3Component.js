import React,{ useEffect,useState } from 'react';
import Web3 from 'web3'
import alertify from 'alertifyjs';
import 'alertifyjs/build/css/alertify.css';
import getFiles from './FetcherComponent';
const EthCrypto = require('eth-crypto');

const WebComponent = (props) => {
    const web3a = new Web3("http://127.0.0.1:7545");
    const hash = props.transactionId;
    const [encKey,setEncKey] = useState("");

    const getFilePath = (transaction_data,decryption_key) => {
    
        let transaction_data_mod = transaction_data.replace("0x","");
        fetch('http://backend.local/getFilePath?filepath='+transaction_data_mod)
        .then(async (response) => {
            decryption_key = await EthCrypto.decryptWithPrivateKey(decryption_key,response.headers.get('X-Signed-Enc-Key'))
            return response.json()
        })
        .then(json => {
            json.map((filepath)=>{
                getFiles(filepath,decryption_key);
            });
        })
        .catch(error => console.error(error));
    
    };
    
    // const hash = "0x4e24ae7f92dc2c9fd1009a0f1de017ca6f43265bdc8efa1ec84553dcac745b89";
    const getTransaction = () =>{
        if(hash === "" || hash === null || hash === undefined)
        {
            return ;
        }
      web3a.eth.getTransaction(hash, function(err, result) {
        if(result === null)
        {
          alertify.error('Invalid transaction Id');      
          return;
        }
    
        if (result.value) {
            alertify.success('Sucessfully verified transaction!');
            getFilePath(result.input,props.decryption_key);
        }
    });
    }

    useEffect(()=>{
      getTransaction();
    },[hash]);
    return (
        <div></div>
    );
    
}



export default WebComponent;
