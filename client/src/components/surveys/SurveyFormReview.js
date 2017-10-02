// SurveyFormReview shows created form to review
import React from 'react';
import { connect } from 'react-redux';
import FIELDS from './formFields';

//const renderFormValues = ()

const SurveyFormReview = ({ onCancel, formValues }) => {
  return (
    <div>
      <h5>Survey Review</h5>
      <button onClick={onCancel} className="yellow darken-3 btn-flat">Go Back</button>
    </div>
  );
};

function mapStateToProps({ form }) {
  return {
    formValues: form.surveyForm.values
  }
}

export default connect(mapStateToProps)(SurveyFormReview);