import { useState } from "react";
import Header from "../Component/Header"
import PatientInfo from "../Component/PatientInfo";
import UploadComponent from "../Component/UploadComponent";

function Homepage(props){

    const [patient,setPatient] = useState(undefined); 
    const setCredentials = props.setCredentials;

    return (
        <div>
            <Header setCredentials = {setCredentials}></Header>
            {
            patient===undefined?
            <PatientInfo setPatient= {setPatient}></PatientInfo>
            :
            <UploadComponent setPatient= {setPatient} patient = {patient}></UploadComponent>
            }
        </div>
    )

}

export default Homepage;