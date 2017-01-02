import React, { Component } from 'react'
import { connect } from 'react-redux'
import * as sessionActions from '../actions/sessionActions'
import Router from '../router'

export class Login extends Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    this.props.signIn(this.props.params.loginToken)
  }

  componentWillReceiveProps(nextProps) {
    if (this.isSignedIn(nextProps)) {
      return Router.navigate('/vehicles', null, { replace: true })
    }
  }

  isSignedIn(props = this.props) {
    return props.state.session.authToken
  }

  render() {
    return null
  }
}

export default connect((state) => ({state}), sessionActions)(Login)
