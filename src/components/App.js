import React, { Component } from 'react'
import { connect } from 'react-redux'
import Welcome from './Welcome'

export class App extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <Welcome />
    )
  }
}

export default connect((state) => ({state}))(App)
