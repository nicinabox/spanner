import React, { Component } from 'react'
import { connect } from 'react-redux'
import logoWhite from '../images/logo-white.png'
import HeaderAccount from './HeaderAccount'

export class Header extends Component {
  constructor(props) {
    super(props)
  }

  renderLeft() {
    if (this.props.renderLeft) return this.props.renderLeft()

    return (
      <div className="col-sm-4 hidden-sm hidden-xs">
      </div>
    )
  }

  renderCenter() {
    if (this.props.renderCenter) return this.props.renderCenter()

    return (
      <div className="col-sm-4 text-center hidden-sm hidden-xs">
        <a href="/" id="logo">
          <img src={logoWhite} alt="" />
        </a>
      </div>
    )
  }

  renderRight() {
    if (this.props.renderRight) return this.props.renderRight()

    return (
      <div className="col-sm-4">
        <nav className="pull-right">
          <HeaderAccount />
        </nav>
      </div>
    )
  }

  render() {
    return (
      <div id="header">
        <nav className="navbar navbar-default navbar-fixed-top">
          <div className="container-fluid">
            <div>
              {this.renderLeft()}
              {this.renderCenter()}
              {this.renderRight()}
            </div>
          </div>
        </nav>
      </div>
    )
  }
}

export default connect((state) => ({state}))(Header)
