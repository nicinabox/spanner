import React, { Component } from 'react'
import { result } from 'lodash'
import { connect } from 'react-redux'
import Router from '../router'

export class App extends Component {
  constructor(props) {
    super(props)

    this.handleEnter = this.handleEnter.bind(this)

    this.state = {
      path: window.location.pathname
    }
  }

  componentDidMount() {
    Router.onNavigate((nextPath) => {
      this.setState({ path: nextPath })
    })
  }

  isSignedIn(props = this.props) {
    return props.state.session.authToken
  }

  handleEnter(Component) {
    if (result(Component, 'route.requireAuth')) {
      if (!this.isSignedIn()) {
        Router.navigate('/', { replace: true })
      }
    }
  }

  render() {
    return <Router path={this.state.path} onEnter={this.handleEnter} />
  }
}

export default connect((state) => ({state}))(App)
