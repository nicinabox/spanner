const initialState = {}
import { SUCCESS } from '../utils/httpActions'
import {
  RECEIVE_REMINDERS,
  CREATE_REMINDER,
  DESTROY_REMINDER,
  UPDATE_REMINDER,
} from '../actions/remindersActions'

export default (state = initialState, action) => {
  const { params } = action

  switch (action.type) {
    case RECEIVE_REMINDERS + SUCCESS:
      return {
        ...state,
        [params.vehicleId]: action.body
      }

    case CREATE_REMINDER + SUCCESS:
      return {
        ...state,
        [params.vehicleId]: state[params.vehicleId].concat(action.body)
      }

    case UPDATE_REMINDER + SUCCESS:
      return {
        ...state,
        [params.vehicleId]: state[params.vehicleId].map((r) => {
          if (r.id === params.reminderId) {
            return action.body
          }
          return r
        })
      }

    case DESTROY_REMINDER + SUCCESS:
      return {
        ...state,
        [params.vehicleId]: state[params.vehicleId]
          .filter((r) => r.id !== params.reminderId)
      }

    default:
      return state
  }
}
