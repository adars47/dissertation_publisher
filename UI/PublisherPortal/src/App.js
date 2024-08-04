import { useState } from 'react';
import './App.css';
import SignIn from './Pages/Login';
import Homepage from './Pages/Homepage';

function App() {
  const [credentials, setCredentials] = useState(localStorage.getItem("credentials"))

  if(!credentials){
    return (
      <div className="App">
        <SignIn credentials={credentials} setCredentials= {setCredentials} ></SignIn>
      </div>
    );  
  }

  return (
    <div className='App'>
      <Homepage setCredentials = {setCredentials}></Homepage>
    </div>
  )

}

export default App;
