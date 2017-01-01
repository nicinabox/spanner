import { omit } from 'lodash'

import { RECEIVE_URL, CLEAR_URL } from '../actions/appActions'

export default function(state = {}, action) {
  switch (action.type) {
    case RECEIVE_URL:
      return {
        url: action.url,
      }

    case CLEAR_URL:
      return omit(state, 'url')

    default:
      return state
  }
}
