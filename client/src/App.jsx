import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css'
import { Login } from './pages/Login';

import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Dashboard } from './pages/Dashboard';

function App() {

  return (
    <Router>
      <Switch>
        <Route exact path='/'>
          <Login/>
        </Route>
        <Route path='/Dashboard'>
          <Dashboard/>
        </Route>
      </Switch>
      <Login/>
    </Router>
  )
}

export default App
