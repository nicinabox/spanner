import React, { Component } from 'react'
import { connect } from 'react-redux'
import * as sessionActions from '../actions/sessionActions'
import Modal from './Modal'

export class HeaderAccount extends Component {
  constructor(props) {
    super(props)
    this.handleLogout = this.handleLogout.bind(this)
    this.handleEmailClick = this.handleEmailClick.bind(this)
  }

  handleLogout(e) {
    e.preventDefault()
    this.props.signOut(this.props.state.session)
  }

  handleEmailClick(e) {
    Modal.open({
      el: e.currentTarget,
      children: (
        <ul className="nav nav-pills nav-stacked">
          <li>
            <a href="javascript:;" onClick={this.handleLogout} className=" text-danger">Sign Out</a>
          </li>
        </ul>
      )
    })
  }

  render() {
    return (
      <a href="javascript:;" onClick={this.handleEmailClick} className="btn btn-default">
        {this.props.state.session.email}
      </a>
    )
  }
}

export default connect((state) => ({state}), sessionActions)(HeaderAccount)
