import React, { Component } from 'react'
import { connect } from 'react-redux'

export class Vehicles extends Component {
  static route = {
    requireAuth: true
  }

  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div>
        <h1>Vehicles</h1>
        <a href="/random/123">Internal (404)</a>
        <a href="http://google.com">External</a>
      </div>
    )
  }
}

export default connect((state) => ({state}))(Vehicles)
