const initialState = {}
import { SUCCESS, PENDING, ERROR } from '../utils/httpActions'
import {
  REQUEST_SESSION,
  SIGN_IN,
  SIGN_OUT,
  RESET_SESSION,
  UPDATE_USER,
} from '../actions/sessionActions'

const demoAccounts = ['demo@spanner']

export default (state = initialState, action) => {
  switch (action.type) {
    case REQUEST_SESSION + PENDING:
      return {
        loginPending: true,
        demoAccount: demoAccounts.includes(action.params.email)
      }

    case REQUEST_SESSION + ERROR:
      return {
        ...state,
        loginPending: false
      }

    case REQUEST_SESSION + SUCCESS:
      return {
        ...state,
        ...action.body
      }

    case SIGN_IN + SUCCESS:
      return action.body

    case SIGN_OUT + SUCCESS:
    case RESET_SESSION:
      return initialState

    case UPDATE_USER + SUCCESS:
      let body = {
        ...action.body,
        user_id: action.body.id
      }
      delete body.id

      return {
        ...state,
        ...body
      }

    default:
      return state
  }
}
