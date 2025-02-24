import './App.css'
import { BrowserRouter as Router , Routes, Route} from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Chat from './pages/Chat'
import { useAuth } from "./context/AuthContext";

function App() {
 
  const auth = useAuth();

  return (
   <>
   
     <Router>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/login' element={<Login />} />
          <Route path='/signup' element={<Signup/>} />
          {auth?.isLoggedIn && auth.user && (
          <Route path="/chat" element={auth?.isLoggedIn && auth.user ? <Chat /> : <Login />} />

        )}
        
        </Routes>
     </Router>
    
   </>
  )
}




export default App

