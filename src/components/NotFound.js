import React, { Component } from 'react'
import { connect } from 'react-redux'

export class NotFound extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <h1>Not found</h1>
    )
  }
}

export default connect((state) => ({state}))(NotFound)
