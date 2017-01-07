const initialState = []
import { SUCCESS } from '../utils/httpActions'
import {
  RECEIVE_VEHICLES,
  RECEIVE_VEHICLE,
  CREATE_VEHICLE,
  UPDATE_VEHICLE,
  DESTROY_VEHICLE,
} from '../actions/vehiclesActions'

export default (state = initialState, action) => {
  switch (action.type) {
    case RECEIVE_VEHICLES + SUCCESS:
      return action.body

    case CREATE_VEHICLE + SUCCESS:
      return state.concat(action.body)

    case RECEIVE_VEHICLE + SUCCESS:
    case UPDATE_VEHICLE + SUCCESS:
      return state.map((v) => {
        if (v.id === action.params.vehicleId) {
          return action.body
        }

        return v
      })

    case DESTROY_VEHICLE + SUCCESS:
      return state.filter((v) => v.id !== action.params.vehicleId)

    default:
      return state
  }
}
