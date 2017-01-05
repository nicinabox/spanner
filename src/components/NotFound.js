import React, { Component } from 'react'
import { connect } from 'react-redux'

export class NotFound extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div id="main">
        <div className="container">
          <div className="row">
            <div className="col-sm-6 col-sm-offset-3 text-center">
              <h1>Not Found</h1>
              <span>404</span>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default connect((state) => ({state}))(NotFound)
