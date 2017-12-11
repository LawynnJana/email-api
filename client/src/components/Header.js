import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import * as actions from '../actions';
import Payments from './Payments';

class Header extends Component {
  constructor(props) {
    super(props);
    this.renderContent = this.renderContent.bind(this);
  }
  renderContent() {
    const { auth } = this.props;
    switch(auth) {
      case null:
        return;
      case false:
        return <li><a href="/auth/google">Login with Google</a></li>
      default:
        return [
          <li key="1" >
            <Link className="btn" to="/surveys" style={{color: '#212121', margin: '0 1px'}}>Surveys</Link>
          </li>,
          <li key="2" style={{margin:'0 10px'}}><Payments/></li>,
          <li key="3"><button className="btn" style={{color: '#212121', marginRight: '6px'}}> Credits: {auth.credits}</button></li>,
          <li key="4"><a href="/api/logout"><i className="material-icons" style={{color: '#212121'}}>power_settings_new</i></a></li>
        ]
    }
  }
  render(){
    const { auth } = this.props;
    return (
      <nav>
        <div className="nav-wrapper">
          <Link to='/'  style={{fontFamily:'Montserrat, Helvetica', fontSize: '40px', color: '#212121', marginLeft:'10px'}}>Emplate</Link>
          <ul id="nav-mobile" className="right" style={{textTransform: 'uppercase', color:''}}>       
            {this.renderContent()}
          </ul>
        </div>
      </nav>
    )
  }
}
const mapStateToProps = (state) => {
  return { auth: state.auth }
}

export default connect(mapStateToProps)(Header);