// SurveyFormReview shows created form to review
import React from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import { withRouter } from 'react-router-dom';

import FIELDS from './formFields';
import * as actions from '../../actions';

//const renderFormValues = ()

const SurveyFormReview = ({ onCancel, formValues, submitSurvey, history }) => { 

  const reviewFields = _.map(FIELDS, ({ label, name }) => {
    return (
      <div key={name}>
        <label>{label}</label>
        <div>
          {formValues[name]}
        </div>
      </div>
    );
  });
  return (
    <div>
      <h5>Survey Review</h5>
      {reviewFields}
      <button onClick={onCancel} className="yellow darken-3 btn-flat white-text">Go Back</button>
      <button onClick={() => submitSurvey(formValues, history)} className="green right btn-flat white-text">
        Send Survey
        <i className="material-icons right">email</i>
      </button>
    </div>
  );
};

function mapStateToProps({ form }) {
  return {
    formValues: form.surveyForm.values
  }
}

export default connect(mapStateToProps, actions)(withRouter(SurveyFormReview));