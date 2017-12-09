import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchSurveys } from '../../actions';

class SurveyList extends Component {
  
  constructor(props) {
    super(props)
    //this.renderSurveys = this.renderSurveys.bind(this);
  }

  componentDidMount() {
    this.props.fetchSurveys();
  }

  renderSurveys() {
    return this.props.surveys.reverse().map(survey => {
      return (
        <div className="card blue-grey" key={survey._id}>
          <div className="card-content white-text">
            <span className="card-title">{survey.title}</span>
            <p>
              {survey.body}
            </p>
            <p className="right">
              Sent On: {new Date(survey.dateSent).toLocaleDateString()}
            </p>
          </div>
          <div className="card-action">
            <a>Yes: {survey.yes} </a>
            <a>No: {survey.no} </a>
            <button className="btn-floating right btn-small waves-effect waves-light red"><i className="material-icons">delete</i></button>

          </div>
        </div>
      );
    })
  }

  render() {
    return (
      <div>
        {this.renderSurveys()}
      </div>
    );
  }
}

const mapStateToProps = ({ surveys }) => {
  return { surveys };
}
export default connect(mapStateToProps, {fetchSurveys})(SurveyList);