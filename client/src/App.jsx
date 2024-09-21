import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// * Imported Pages
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';



function App() {

  return (
    <Router>
      <Routes>
        <Route path='/' element={<Login/>}/>

        <Route path=' Dashboard' element={<Dashboard/>}> 
          <Route path=' Product' element={}/>
          <Route path=' Reports' element={}/>
          <Route path=' Accounts' element={}/>
        </Route>

      </Routes>
    </Router>
  )
}

export default App
