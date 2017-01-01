const initialState = {}
import { SUCCESS } from '../utils/httpActions'
import {
  RECEIVE_RECORDS,
  CREATE_RECORD,
  DESTROY_RECORD,
  UPDATE_RECORD,
} from '../actions/recordsActions'

export default (state = initialState, action) => {
  const { params } = action

  switch (action.type) {
    case RECEIVE_RECORDS + SUCCESS:
      return {
        ...state,
        [params.vehicleId]: action.body
      }

    case CREATE_RECORD + SUCCESS:
      return {
        ...state,
        [params.vehicleId]: state[params.vehicleId].concat(action.body)
      }

    case UPDATE_RECORD + SUCCESS:
      return {
        ...state,
        [params.vehicleId]: state[params.vehicleId].map((r) => {
          if (r.id === params.recordId) {
            return action.body
          }
          return r
        })
      }

    case DESTROY_RECORD + SUCCESS:
      return {
        ...state,
        [params.vehicleId]: state[params.vehicleId]
          .filter((r) => r.id !== params.recordId)
      }

    default:
      return state
  }
}
