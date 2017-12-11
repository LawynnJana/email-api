import React from 'react';
import { Link } from 'react-router-dom'
import SurveysList from './surveys/SurveyList';

const Dashboard = () => {
  return (
    <div>
      <SurveysList />
      <div className="fixed-action-btn">
        <Link to="/surveys/new" className="btn-floating btn-large red">
          <i className="material-icons" style={{color: '#212121', backgroundColor:'#ef5350'}}>add</i>
        </Link>
      </div>
    </div>
  )
}

export default Dashboard;