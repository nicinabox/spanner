const initialState = []
import { SUCCESS } from '../utils/httpActions'
import {
  RECEIVE_SESSIONS,
  DESTROY_SESSION,
} from '../actions/sessionActions'

export default (state = initialState, action) => {
  switch (action.type) {
    case RECEIVE_SESSIONS + SUCCESS:
      return action.body

    case DESTROY_SESSION + SUCCESS:
      return state.filter((s) => s.id !== action.params.sessionId)

    default:
      return state
  }
}
