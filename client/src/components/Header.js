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
          <li key="1"><Payments/></li>,
          <li key="2" style={{margin:'0 10px'}}>Credits: {auth.credits}</li>,
          <li key="3"><a href="/api/logout">Logout</a></li>
        ]
    }
  }
  render(){
    const { auth } = this.props;
    return (
      <nav>
        <div className="nav-wrapper">
          <Link to={auth ? `/surveys` : '/'} className="" style={{fontFamily:'Montserrat, Helvetica', fontSize: '40px'}}>Emplate</Link>
          <ul id="nav-mobile" className="right">       
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