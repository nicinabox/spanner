import React, { Component } from 'react'
import { connect } from 'react-redux'
import logoWhite from '../images/logo-white.png'

export class Header extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div id="header">
        <nav className="navbar navbar-default navbar-fixed-top">
          <div className="container-fluid">
            <div className="">
              <div className="col-sm-4 hidden-sm hidden-xs">
              </div>
              <div className="col-sm-4 text-center hidden-sm hidden-xs">
                <a href="/" id="logo">
                  <img src={logoWhite} alt="" />
                </a>
              </div>
              <div className="col-sm-4">
                <nav className="pull-right">
                  [session]
                </nav>
              </div>
            </div>
          </div>
        </nav>
      </div>
    )
  }
}

export default connect((state) => ({state}))(Header)
