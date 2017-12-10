// SurveyForm shows a form to add input
import React, { Component } from 'react';
import { reduxForm, Field } from 'redux-form';
import { Link } from 'react-router-dom';
import _ from 'lodash';

import SurveyField from './SurveyField';
import SurveyFileField from './SurveyFileField';

import validateEmails from '../../utils/validateEmails';
import FIELDS, { CONTACTS_CSV } from './formFields';

class SurveyForm extends Component {
  
  renderFields() {
    return _.map(FIELDS, ({label, name}) => {
      if(name === 'fromEmail') return <Field type="text" key={name} name={name} label={label} placeholder="no-reply@email.com" component={SurveyFileField} />;
      return <Field type="text" key={name} name={name} label={label} component={SurveyField} />; 
    }) 
  }

  render() {
    return (
      <div>
        <h1>Survey Form</h1>
        <form onSubmit={this.props.handleSubmit(this.props.onSurveySubmit)}>
          {this.renderFields()}
          <Field type="file" key={'file'} name={CONTACTS_CSV} label={'Import File'} component={SurveyFileField} />
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
  
  // File type validation
  if(values[CONTACTS_CSV] && Object.keys(values[CONTACTS_CSV]).length > 0){
    console.log(values[CONTACTS_CSV]['0']);
    if(values[CONTACTS_CSV]['0'].type !== 'text/csv' && values[CONTACTS_CSV]['0'].type !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' && values[CONTACTS_CSV]['0'].type !== 'application/vnd.ms-excel'){
       errors[CONTACTS_CSV] = "Please provide a valid file";
    } 
  }
  _.each(FIELDS, ({name}) => {
    if(!values[name] && name !== 'fromEmail') errors[name] = 'You must provide a value';
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
    recipients: 'jlawynn@gmail.com'  
  }
})(SurveyForm);