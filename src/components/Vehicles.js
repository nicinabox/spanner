import React, { Component } from 'react'
import { connect } from 'react-redux'
import * as vehiclesActions from '../actions/vehiclesActions'
import Header from './Header'

export class Vehicles extends Component {
  static route = {
    requireAuth: true
  }

  constructor(props) {
    super(props)

    this.handleAddVehicleClick = this.handleAddVehicleClick.bind(this)
  }

  componentDidMount() {
    this.props.fetchVehicles()
  }

  handleAddVehicleClick(e) {
    e.preventDefault()
  }

  renderVehicle(vehicle, i) {
    return (
      <div className="col-md-3" key={i}>
        <a href={`/vehicles/${vehicle.id}`} className="vehicle" data-params={JSON.stringify(vehicle)}>
          <span>
            {vehicle.name}
          </span>

          {vehicle.vin ? (
            <small className="text-muted">
              VIN: {vehicle.vin}
            </small>
          ) : null}
        </a>
      </div>
    )
  }

  render() {
    return (
      <div id="vehicles">
        <Header />

        <div id="main">
          <div className="container">
            <div className="row">
              <h5 className="row-heading">
                <span className="fa fa-car fa-fw"></span>
                All Vehicles
              </h5>

              {this.props.state.vehicles.map(this.renderVehicle)}

              <form className="col-md-3">
                <a href="#" onClick={this.handleAddVehicleClick} className="vehicle add-vehicle">
                  <span>Add a vehicle&hellip;</span>
                </a>
              </form>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default connect((state) => ({state}), vehiclesActions)(Vehicles)
