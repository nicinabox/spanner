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
    Router.onNavigate((nextPath, params) => {
      this.setState({ path: nextPath, params })
    })
  }

  isSignedIn(props = this.props) {
    return props.state.session.authToken
  }

  handleEnter(Component) {
    if (result(Component, 'route.requireAuth')) {
      if (!this.isSignedIn()) {
        Router.navigate('/', null, { replace: true })
      }
    }
  }

  render() {
    return <Router
      path={this.state.path}
      params={this.state.params}
      onEnter={this.handleEnter} />
  }
}

export default connect((state) => ({state}))(App)
