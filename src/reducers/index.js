import { combineReducers } from 'redux'
import app from './appReducer'
import session from './sessionReducer'
import sessions from './sessionsReducer'
import vehicles from './vehiclesReducer'
import records from './recordsReducer'
import reminders from './remindersReducer'

const lastAction = (state = null, action) => action

let reducers = combineReducers({
  app,
  lastAction,
  session,
  sessions,
  vehicles,
  records,
  reminders,
})

const initialState = {}

export default (state = initialState, action) => {
  switch (action.type) {
    case 'SIGN_OUT_PENDING':
      return reducers(initialState, action)

    default:
      return reducers(state, action)
  }
}
