import React, { Component } from 'react'
import { connect } from 'react-redux'
import * as vehiclesActions from '../actions/vehiclesActions'
import Header from './Header'

export class Vehicle extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div>
        <Header />

      </div>
    )
  }
}

export default connect((state) => ({state}), vehiclesActions)(Vehicle)
