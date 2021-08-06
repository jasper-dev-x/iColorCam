import './App.css';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import Camera from './pages/Camera';

function App() {
  return (
    <BrowserRouter>
      <div className="d-flex bg-light" style={ { minHeight: window.innerHeight } }>
        <Switch>
          <Route path="/" exact>
            <Home />
          </Route>
          <Route path="/camera">
            <Camera />
          </Route>
          <Route>
            <NotFound />
          </Route>
        </Switch>
      </div>
    </BrowserRouter>
  );
}

export default App;
