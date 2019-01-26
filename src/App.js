import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Redirect, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';
import './App.css';
import store from './store';
import LoginAndRegister from './pages/loginAndRegister';
import Index from './pages/index';

class App extends Component {
  render() {
    return (
      <div className="app">
        <Provider store={store}>
          <Router>
            <div style={{height: "100%"}}>
              <Switch>
                <Route path="/index" component={Index} />
                <Route path="/loginAndRegister" component={LoginAndRegister} />
                <Redirect to="/index" />
              </Switch>
            </div>
          </Router>
        </Provider>
      </div>
    );
  }
}

export default App;
