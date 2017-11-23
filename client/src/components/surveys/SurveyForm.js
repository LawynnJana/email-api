// SurveyForm shows a form to add input
import React, { Component } from 'react';
import { reduxForm, Field } from 'redux-form';
import { Link } from 'react-router-dom';
import _ from 'lodash';

import SurveyField from './SurveyField';
import SurveyFileField from './SurveyFileField';

import validateEmails from '../../utils/validateEmails';
import FIELDS from './formFields';

class SurveyForm extends Component {
  
  renderFields() {
    return _.map(FIELDS, ({label, name}) => {
      //if(name === 'recipients') return <Field type="text" key={name} name={name} label={label} component={SurveyFileField} />;
      return <Field type="text" key={name} name={name} label={label} component={SurveyField} />; 
    }) 
  }

  render() {
    return (
      <div>
        <h1>Survey Form</h1>
        <form onSubmit={this.props.handleSubmit(this.props.onSurveySubmit)}>
          {this.renderFields()}
          <Field type="file" key={'file'} name={'recipientFile'} label={'Import File'} component={SurveyFileField} />; 
          <Link to="/surveys" className="red btn-flat left white-text">
            Cancel
          </Link>
          <button className="teal btn-flat right white-text" type="submit">
            Submit
            <i className="material-icons right">done</i>
          </button>
        </form>
      </div>
    );
  }
}

const validate = (values) => {
  const errors = {};
  console.log('Validate', values);
  errors.recipients = validateEmails(values.recipients || '');
  
  _.each(FIELDS, ({name}) => {
    if(!values[name]) errors[name] = 'You must provide a value';
  })



  return errors;
}

export default reduxForm({
  form: 'surveyForm',
  validate,
  destroyOnUnmount: false, //don't dump values on redirect
  initialValues: {
    title: 'Temp',
    subject: 'Temp',
    body: 'Temp',
    recipients: 'Temp@gmail.com'  
  }
})(SurveyForm);