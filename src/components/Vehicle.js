import React, { Component } from 'react'
import { connect } from 'react-redux'
import * as vehiclesActions from '../actions/vehiclesActions'
import * as remindersActions from '../actions/remindersActions'
import * as recordsActions from '../actions/recordsActions'
import Router from '../router'
import Header from './Header'
import Records from './Records'
import Reminders from './Reminders'
import RecordForm from './RecordForm'
import ReminderForm from './ReminderForm'
import VehicleMenu from './VehicleMenu'
import Notes from './Notes'
import Modal from './Modal'

export class Vehicle extends Component {
  constructor(props) {
    super(props)

    this.renderHeaderLeft = this.renderHeaderLeft.bind(this)
    this.renderHeaderCenter = this.renderHeaderCenter.bind(this)
    this.toggleVehicleMenu = this.toggleVehicleMenu.bind(this)
    this.handleAddService = this.handleAddService.bind(this)
    this.handleAddReminder = this.handleAddReminder.bind(this)
    this.handleSearch = this.handleSearch.bind(this)

    this.state = {
      search: ''
    }
  }

  componentDidMount() {
    this.props.fetchVehicle(this.props.params.id)
  }

  handleSearch(e) {
    this.setState({
      search: e.target.value
    })
  }

  toggleVehicleMenu(e) {
    e.preventDefault()
    Modal.open({
      el: e.currentTarget,
      children: (
        <VehicleMenu
          vehicle={this.props.state.vehicle}
          fetchRecords={this.props.fetchRecords}
          updateVehicle={this.props.updateVehicle}
          destroyVehicle={this.props.destroyVehicle}
          importRecords={this.props.importRecords}
          exportRecords={this.props.exportRecords}
        />
      )
    })
  }

  handleAddService(e, record) {
    e.preventDefault()
    Modal.open({
      el: e.currentTarget,
      style: { width: 600 },
      children: <RecordForm
        {...record}
        vehicle={this.props.state.vehicle}
        onSubmit={(props) => {
          this.props.createRecord(this.props.state.vehicle.id, props)
          Modal.close()
        }}
        onConfirmDestroy={(id) => {
          this.props.destroyRecord(id)
          Modal.close()
        }} />
    })
  }

  handleAddReminder(e, reminder) {
    e.preventDefault()
    Modal.open({
      el: e.currentTarget,
      children: <ReminderForm
        {...reminder}
        vehicle={this.props.state.vehicle}
        onSubmit={(props) => {
          this.props.createReminder(this.props.state.vehicle.id, props)
          Modal.close()
        }}
        onConfirmDestroy={(id) => {
          this.props.destroyReminder(this.props.state.vehicle.id, id)
          Modal.close()
        }} />
    })
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
          <input
            type="search"
            className="form-control text-center"
            placeholder="Search"
            onChange={this.handleSearch}
          />
        </form>
      </div>
    )
  }

  renderHeaderRight() {
    return null
  }

  render() {
    return (
      <div id="vehicle">
        <Header
          renderLeft={this.renderHeaderLeft}
          renderCenter={this.renderHeaderCenter}
          renderRight={this.renderHeaderRight}
        />

        <div className="container action-bar">
          <div className="row">
            <div className="col-sm-6">
              {!this.props.state.vehicle.retired && (
                <nav>
                  <a href="javascript:;" onClick={this.handleAddService} className="js-add-service btn btn-secondary">
                    + Add Service
                  </a>
                  <a href="javascript:;" onClick={this.handleAddReminder} className="js-add-reminder btn btn-secondary">
                    + Add Reminder
                  </a>
                </nav>
              )}
            </div>

            <div className="col-sm-6">
              <div className="row text-right text-muted">
                <div className="col-md-6">
                  {this.props.state.vehicle.vin ? (
                    <p>
                      VIN: {this.props.state.vehicle.vin}
                    </p>
                  ) : null}
                </div>

                {this.props.state.vehicle.milesPerYear ? (
                  <div className="col-md-6">
                    <p>
                      You drive about {this.props.state.vehicle.milesPerYear.toLocaleString()} miles a year
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
              <div className="col-sm-8">
                <Records vehicleId={this.props.params.id} search={this.state.search} />
              </div>

              <div className="col-sm-3 col-sm-offset-1">
                <Reminders vehicleId={this.props.params.id} reminders={this.props.reminders} />

                <Notes
                  notes={this.props.state.vehicle.notes}
                  onSubmit={(notes) => {
                    this.props.updateVehicle(this.props.state.vehicle.id, { notes })
                  }}
                />
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
}), {
  ...vehiclesActions,
  ...remindersActions,
  ...recordsActions,
})(Vehicle)
