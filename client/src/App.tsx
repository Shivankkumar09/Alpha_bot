import './App.css'
import { BrowserRouter as Router , Routes, Route} from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Chat from './pages/Chat'
import { useAuth } from "./AuthContext";

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
          <Route path="/chat" element={<Chat />} />
        )}
        
        </Routes>
     </Router>
    
   </>
  )
}




export default App

