import { FETCH_USER } from '../actions/types'

export default function(state = null, action){
  console.log(action);
  switch(action.type){
    case FETCH_USER:
      return action.payload || false //action.payload is "" when user isn't logged in and is evaluated to false if ""
    default:
      return state;
  }
}