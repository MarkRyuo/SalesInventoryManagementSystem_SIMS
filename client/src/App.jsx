import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// * Imported Pages
import { Login, Dashboard, Product, Reports, Accounts } from './pages' ;



function App() {

  return (
    <Router>
      <Routes>
        <Route path='/' element={<Login/>}/>

        <Route path='/Dashboard' element={<Dashboard/>}> 
          <Route path='Product' element={<Product />}/>
          <Route path='Reports' element={<Reports />}/>
          <Route path='Accounts' element={<Accounts />}/>
        </Route>

      </Routes>
    </Router>
  )
}

export default App
