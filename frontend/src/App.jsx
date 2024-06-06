import './App.css';
import Home from './pages/home/Home.jsx';
import Login from './pages/login/Login.jsx';
import Signup from './pages/signUp/Signup.jsx';

function App() {
 
  return (
    <div className='h-screen flex justify-center items-center'>
      <Home />
      {/* <Signup/> */}
    </div>
  )
}

export default App
