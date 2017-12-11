import axios from 'axios';
import { FETCH_USER, FETCH_SURVEYS } from './types';  
import FormData from 'form-data';

export const fetchUser = () => async dispatch => {
  const res = await axios.get('/api/current_user');
  dispatch({ type: FETCH_USER, payload: res.data }); 
}

export const handleToken = token => async dispatch => {
  const res = await axios.post('/api/stripe', token);
  dispatch({type: FETCH_USER, payload: res.data }); 
}

export const submitSurvey = (values, history) => {
  let data = new FormData();
  if(values.recipientFile) data.append('file', values.recipientFile[0]);
  for(let key in values) {
    console.log(key, ':', values[key]);
    if(key !== 'recipientFile')
      data.append(key ,values[key]);
  }


  return async dispatch => {
    const res = await axios.post('/api/surveys', data);
    history.push('/surveys');
    dispatch({ type: FETCH_USER, payload: res.data})
  }
}

export const fetchSurveys = () => async dispatch => {
  const res = await axios.get('/api/surveys');
  dispatch({ type: FETCH_SURVEYS, payload: res.data });
}

export const deleteSurvey = (survey_id) => {
  return async (dispatch) => {
    const res = await axios.post(`/api/surveys/delete?survey_id=${survey_id}`);
    dispatch({ type: FETCH_SURVEYS, payload: res.data});
  }
}