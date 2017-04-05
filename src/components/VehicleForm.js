import React, { Component } from 'react'
import { pick } from 'lodash'
import ModalHeader from './ModalHeader'
import handleInputChange from '../utils/handleInputChange'

export default class VehicleForm extends Component {
  constructor(props) {
    super(props)

    this.handleInputChange = handleInputChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleDestroy = this.handleDestroy.bind(this)
    this.handleConfirmDestroy = this.handleConfirmDestroy.bind(this)
    this.handleCancelDestroy = this.handleCancelDestroy.bind(this)

    let initialState = props.id ? props : {
      name: '',
      vin: '',
      enableCost: true,
      retired: false,
    }

    this.state = {
      ...initialState,
      confirmation: '',
      error: false,
      modalTitle: this.getModalTitle(props),
      modalBack: false
    }
  }

  getModalTitle(props = this.props) {
    return props.id ? 'Edit Vehicle' : 'Add Vehicle'
  }

  handleSubmit(e) {
    e.preventDefault()
    let props = pick(this.state, 'id', 'name', 'vin', 'retired', 'enableCost')
    this.props.onSubmit(props)
  }

  handleDestroy(e) {
    e.preventDefault()
    this.setState({
      confirmDestroy: true,
      modalTitle: 'Remove Vehicle',
      modalBack: this.handleCancelDestroy
    })
  }

  handleCancelDestroy() {
    this.setState({
      confirmDestroy: false,
      modalTitle: this.getModalTitle(),
      modalBack: false,
    })
  }

  handleConfirmDestroy(e) {
    e.preventDefault()
    if (this.state.confirmation === this.props.name) {
      return this.props.onConfirmDestroy(this.props.id)
    }

    this.setState({
      error: true
    })
  }

  renderConfirmDestroy() {
    return (
      <form onSubmit={this.handleConfirmDestroy} className={this.state.error && 'has-error'}>
        <div className="form-group">
          <p className="help-block">
            Removing a vehicle will remove all its records and cannot be undone!
          </p>

          <label className="control-label">
            <em>To confirm, type the name of this vehicle:</em>
          </label>
          <input
            type="text"
            name="confirmation"
            className="form-control"
            value={this.state.confirmation}
            onChange={this.handleInputChange('confirmation')}
            autoFocus
            autoComplete="off"
          />
        </div>

        <button className="btn btn-danger">
          Remove
        </button>
      </form>
    )
  }

  renderForm() {
    return (
      <form onSubmit={this.handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            name="name"
            className="form-control"
            value={this.state.name}
            onChange={this.handleInputChange('name')}
            placeholder="E.g., 2015 Mini Cooper GP"
            autoFocus
            required />
        </div>

        <div className="form-group">
          <label className="control-label" htmlFor="">VIN</label>
          <input
            type="text"
            name="vin"
            className="form-control"
            value={this.state.vin}
            onChange={this.handleInputChange('vin')}
            placeholder="E.g., WMW12345678901234" />
          <small className="help-block">VIN is optional but recommended.</small>
        </div>

        <div className="form-group">
          <label className="control-label" htmlFor="enableCost">
            <input
              id="enableCost"
              type="checkbox"
              checked={this.state.enableCost}
              onChange={this.handleInputChange('enableCost')}/>{' '}
            Enable Cost
          </label>
        </div>

        <div className="form-group">
          <label className="control-label" htmlFor="retired">
            <input
              id="retired"
              type="checkbox"
              checked={this.state.retired}
              onChange={this.handleInputChange('retired')}
              {...(!this.props.id ? { disabled: true } : {})}
            />
            {' '}
            Retire
          </label>
        </div>

        <button className="btn btn-success">
          Save
        </button>

        {this.props.id && (
          <button className="btn btn-danger pull-right" onClick={this.handleDestroy}>
            Remove
          </button>
        )}
      </form>
    )
  }

  render() {
    return (
      <div>
        {this.state.confirmDestroy ? this.renderConfirmDestroy() : this.renderForm()}
      </div>
    )
  }
}

VehicleForm.defaultProps = {
  onSubmit: () => {},
  onConfirmDestroy: () => {},
}
