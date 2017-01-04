import React, { Component } from 'react'
import { connect } from 'react-redux'
import marked from 'marked'
import * as vehiclesActions from '../actions/vehiclesActions'
import Router from '../router'
import Header from './Header'
import Records from './Records'
import Reminders from './Reminders'
import RecordForm from './RecordForm'
import ReminderForm from './ReminderForm'
import VehicleForm from './VehicleForm'
import Modal from './Modal'

export class Vehicle extends Component {
  constructor(props) {
    super(props)

    this.renderHeaderLeft = this.renderHeaderLeft.bind(this)
    this.renderHeaderCenter = this.renderHeaderCenter.bind(this)
    this.toggleVehicleMenu = this.toggleVehicleMenu.bind(this)
    this.handleAddService = this.handleAddService.bind(this)
    this.handleAddReminder = this.handleAddReminder.bind(this)

    this.state = {
    }
  }

  componentDidMount() {
    this.props.fetchVehicle(this.props.params.id)
  }

  toggleVehicleMenu(e) {
    e.preventDefault()
    Modal.open({
      el: e.currentTarget,
      children: (
        <VehicleForm {...this.props.state.vehicle}
          onSubmit={(params) => {
            this.props.updateVehicle(params.id, params)
              .then(() => Modal.close())
          }}
          onConfirmDestroy={(id) => {
            this.props.destroyVehicle(id)
              .then(() => {
                Modal.close()
                Router.navigate('/vehicles')
              })
          }}/>
      )
    })
  }

  handleAddService(e) {
    e.preventDefault()
    Modal.open({ el: e.currentTarget, children: <RecordForm /> })
  }

  handleAddReminder(e) {
    e.preventDefault()
    Modal.open({ el: e.currentTarget, children: <ReminderForm /> })
  }

  renderHeaderLeft() {
    return (
      <div className="col-md-4">
        <a href="/vehicles" className="back btn">
          <i className="fa fa-chevron-left"></i>
        </a>
        {' '}
        <a href="javascript:;" onClick={this.toggleVehicleMenu} className="btn btn-default">
          {this.props.state.vehicle.name}
        </a>
      </div>
    )
  }

  renderHeaderCenter() {
    return (
      <div className="col-sm-4 hidden-sm hidden-xs">
        <form className="navbar-form">
          <input type="search" name="filter" id="filter" className="form-control text-center"
            placeholder="Search" />
        </form>
      </div>
    )
  }

  render() {
    return (
      <div id="vehicle">
        <Header
          renderLeft={this.renderHeaderLeft}
          renderCenter={this.renderHeaderCenter} />

        <div className="container action-bar">
          <div className="row">
            <div className="col-sm-6">
              <nav>
                <a href="javascript:;" onClick={this.handleAddService} className="js-add-service btn btn-secondary">
                  + Add Service
                </a>
                <a href="javascript:;" onClick={this.handleAddReminder} className="js-add-reminder btn btn-secondary">
                  + Add Reminder
                </a>
              </nav>
            </div>

            <div className="col-sm-6">
              <div className="row text-right text-muted">
                <div className="col-md-6">
                  {this.props.vin ? (
                    <p>
                      VIN: {this.props.vin}
                    </p>
                  ) : null}
                </div>

                {this.props.milesPerYear ? (
                  <div className="col-md-6">
                    <p>
                      You drive about {this.props.milesPerYear} miles a year
                    </p>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </div>

        <div id="main">
          <div className="container">
            <div className="row">
              <div className="col-sm-9">
                <Reminders vehicleId={this.props.params.id} reminders={this.props.reminders} />

                <Records vehicleId={this.props.params.id} />
              </div>

              <div className="col-sm-3">
                <h5 className="">
                  <i className="fa fa-book fa-fw"></i>
                  Notes
                </h5>

                <div id="vehicle-notes" className="js-edit-vehicle-notes">
                  {this.props.state.vehicle.notes ? (
                    <div dangerouslySetInnerHTML={{
                      __html: marked(this.props.state.vehicle.notes)
                    }} />
                  ) : (
                    <span className="text-muted">
                      Add notes...
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default connect((state, props) => ({
  state: {
    vehicle: state.vehicles.find(v => v.id === +props.params.id) || props.params
  }
}), vehiclesActions)(Vehicle)
