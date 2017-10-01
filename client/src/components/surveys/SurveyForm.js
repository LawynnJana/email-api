// SurveyForm shows a form to add input
import React, { Component } from 'react';
import { reduxForm, Field } from 'redux-form';
import { Link } from 'react-router-dom';
import SurveyField from './SurveyField';
import _ from 'lodash';

const FIELDS = [
  { label: 'Survey Title', name: 'title' },
  { label: 'Subject Line', name: 'subject' },
  { label: 'Email Body', name: 'body' },
  { label: 'Recipient List', name: 'emails' }
];
class SurveyForm extends Component {
  renderFields() {
    return _.map(FIELDS, ({label, name}) => {
      return <Field type="text" key={name} name={name} label={label} component={SurveyField} />
    }) 
  }

  render() {
    return (
      <div>
        <h1>Survey Form</h1>
        <form onSubmit={this.props.handleSubmit(values => console.log(values))}>
          {this.renderFields()}
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

  _.each(FIELDS, ({name}) => {
    if(!values[name]) errors[name] = 'You must provide a value';
  })

  return errors;
}

export default reduxForm({
  form: 'surveyForm',
  validate,
})(SurveyForm);