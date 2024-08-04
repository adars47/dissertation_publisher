import decryptAndDownload from "../Components/Decrypt";

const getFiles= (filepath,decryption_key) => {
    fetch('http://127.0.0.1:2222/getFile',{
        method: "POST",
        body: JSON.stringify({filePath:filepath})
    })
    .then((response) => response.blob())
    .then((blob) => {
        let filepaths = filepath.split("/");
        const n = filepath.lastIndexOf('/');
        const filename = filepath.substring(n + 1);
        if(filepaths[9]==="personal")
        {
            decryptAndDownload(blob,filename,decryption_key);
            return;
        }
        download(blob,filename);

    })
    .catch(error => console.error(error));

}

const download = (blob,filename) =>
{
    var csvURL = window.URL.createObjectURL(blob);
    let tempLink = document.createElement('a');
    tempLink.href = csvURL;
    tempLink.setAttribute('download', filename);
    tempLink.click();
}

export default getFiles;