import React, { Component } from 'react'
import { connect } from 'react-redux'

export class HeaderAccount extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <a href="#" className="btn btn-default">
        {this.props.state.session.email}
      </a>
    )
  }
}

export default connect((state) => ({state}))(HeaderAccount)
