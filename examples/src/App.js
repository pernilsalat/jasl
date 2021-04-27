import {Link, Switch, Route} from 'react-router-dom'
import {NormalStore} from "./views/NormalStore/NormalStore";
import {ReduxStore} from "./views/ReduxStore/ReduxStore";
import {XstateStore} from "./views/XstateStore/XstateStore";
// import './App.css';

function App() {
  return (
    <div className="App">
      <nav>
        <ul style={{ display: 'flex', justifyContent: 'space-around' }}>
          <li>
            <Link to="/normal-store">normal store</Link>
          </li>
          <li>
            <Link to="/redux-store">Redux store</Link>
          </li>
          <li>
            <Link to="/xstate-store">xstate store</Link>
          </li>
        </ul>
      </nav>
      <Switch>
        <Route path="/normal-store">
          <NormalStore/>
        </Route>
        <Route path="/redux-store">
          <ReduxStore/>
        </Route>
        <Route path="/xstate-store">
          <XstateStore/>
        </Route>
      </Switch>
    </div>
  );
}

export default App;
