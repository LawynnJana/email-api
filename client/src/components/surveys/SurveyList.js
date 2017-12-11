import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchSurveys, deleteSurvey } from '../../actions';

class SurveyList extends Component {
  
  constructor(props) {
    super(props)
    this.handleDelete = this.handleDelete.bind(this);
  }

  componentDidMount() {
    this.props.fetchSurveys();
  }

  handleDelete = (survey_id) => {
    alert("Are you sure you want to delete this survey?");
    console.log('Deleting', survey_id);
    this.props.deleteSurvey(survey_id)
  }

  renderSurveys() {
    console.log('Surveys exist');
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
            <button onClick={() => this.handleDelete(survey._id)} style={{marginRight: '-35px', marginTop: '5px'}} className="btn-floating right btn-small waves-effect waves-light red"><i className="material-icons" style={{color:'#212121'}}>delete</i></button>
          </div>
        </div>
      );
    })
  }

  renderNoSurveys() {
    console.log('No Surveys');
    return (
      <div className="card-panel grey lighten-5 center">
        <p className="flow-text">You don't have any surveys!</p>
      </div>
    )
  }

  render() {
    const { surveys } = this.props;
    console.log('contents', surveys.length);
    return (
      <div>
        { (surveys.length !== 0) ? this.renderSurveys() : this.renderNoSurveys()}
      </div>
    );
  }
}

const mapStateToProps = ({ surveys }) => {
  return { surveys };
}
export default connect(mapStateToProps, {fetchSurveys, deleteSurvey})(SurveyList);