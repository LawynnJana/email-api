// SurveyFormReview shows created form to review
import React from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import { withRouter } from 'react-router-dom';

import FIELDS from './formFields';
import * as actions from '../../actions';

//const renderFormValues = ()

const SurveyFormReview = ({ onCancel, formValues, submitSurvey, history, auth }) => { 

  const reviewFields = _.map(FIELDS, ({ label, name }) => {
    if(name === "fromEmail" && !formValues['fromEmail']) formValues['fromEmail'] = 'no-reply@email.com'
    return (
      <div key={name}>
        <label>{label}</label>
        <div>
          {formValues[name]}
        </div>
      </div>
    );
  });

  const validateCredits = () => {
    if(auth.credits < 1) {
      alert("You do not have enough credits!");
    } 
    else {
      submitSurvey(formValues, history, auth.credits);
    }

  }

  return (
    <div>
      <h5>Survey Review</h5>
      {reviewFields}
      <button onClick={onCancel} className="yellow darken-3 btn-flat white-text">Go Back</button>
      <button onClick={() => validateCredits()} className="green right btn-flat white-text">
        Send Survey
        <i className="material-icons right">email</i>
      </button>
    </div>
  );
};

function mapStateToProps({ form, auth }) {
  return {
    formValues: form.surveyForm.values,
    auth: auth
  }
}

export default connect(mapStateToProps, actions)(withRouter(SurveyFormReview));