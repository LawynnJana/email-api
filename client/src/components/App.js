import 'materialize-css/dist/css/materialize.min.css';
import React, { Component } from 'react';
import { Switch, BrowserRouter, Route } from 'react-router-dom';
import { connect } from 'react-redux';

import * as actions from '../actions';
import Header from './Header';
import Landing from './Landing';
import Dashboard from './Dashboard';
import SurveyNew from './surveys/SurveyNew';

class App extends Component {
  componentDidMount() {
    const { fetchUser } = this.props;
    fetchUser();
  }

  render(){
    return (
      
      <BrowserRouter>
        <div className="container">
          <Header/>
          <Switch>
            <Route exact path='/' render={() => <Landing/>}/>
            <Route path='/surveys/new' render={() => <SurveyNew/>}/>
            <Route path='/surveys' render={() => <Dashboard/>}/>
          </Switch>
        </div>
      </BrowserRouter>
    )
  }
}

export default connect(null, actions)(App);