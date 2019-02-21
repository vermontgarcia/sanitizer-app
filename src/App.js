import React, {Component} from 'react';
import Router from './Router';
import {withRouter} from 'react-router-dom';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
				<Router />        
      </div>
    );
  }
}

export default withRouter(App);
