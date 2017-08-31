import 'materialize-css/dist/css/materialize.min.css';
import React, { Component } from 'react';
import { Switch, BrowserRouter, Route } from 'react-router-dom';
import { connect } from 'react-redux';

import * as actions from '../actions';
import Header from './Header';
import Landing from './Landing';

const Dashboard = () => <h2>Dashboard</h2>
const SurveyNew = () => <h2>SurveyNew</h2>

class App extends Component {
  componentDidMount() {
    const { fetchUser } = this.props;
    fetchUser();
  }

  render(){
    return (
      <div className="container">
        <BrowserRouter>
          <div>
            <Header/>
            <Switch>
              <Route exact path='/' render={() => <Landing/>}/>
              <Route path='/surveys/new' render={() => <SurveyNew/>}/>
              <Route path='/surveys' render={() => <Landing/>}/>
            </Switch>
          </div>
        </BrowserRouter>
      </div>
    )
  }
}

export default connect(null, actions)(App);