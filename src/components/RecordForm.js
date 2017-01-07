import React, { Component } from 'react'
import { format as formatDate, isSameDay, isValid } from 'date-fns'
import { pick } from 'lodash'
import DayPicker from 'react-day-picker'
import ModalHeader from './ModalHeader'
import Textarea from 'react-textarea-autosize'

export default class RecordForm extends Component {
  constructor(props) {
    super(props)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleInputChange = this.handleInputChange.bind(this)
    this.handleDestroy = this.handleDestroy.bind(this)
    this.handleConfirmDestroy = this.handleConfirmDestroy.bind(this)
    this.handleCancelDestroy = this.handleCancelDestroy.bind(this)

    let initialState = props.id ? props : {
      date: new Date,
      cost: '',
      mileage: props.vehicle.estimatedMileage,
      notes: '',
    }

    this.state = {
      ...initialState,
      modalTitle: this.getModalTitle(props),
      modalBack: false,
      showDatepicker: true
    }
  }

  getModalTitle(props = this.props) {
    return props.id ? 'Edit Service' : 'Add Service'
  }

  handleSubmit(e) {
    e.preventDefault()
    let props = pick(this.state, 'id', 'date', 'mileage', 'cost', 'notes')
    this.props.onSubmit(props)
  }

  handleDestroy(e) {
    e.preventDefault()
    this.setState({
      confirmDestroy: true,
      modalTitle: 'Remove Reminder',
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
    return this.props.onConfirmDestroy(this.props.id)
  }

  handleInputChange(name) {
    return (e) => this.setState({ [name]: e.target.value })
  }

  renderNewForm() {
    return (
      <form onSubmit={this.handleSubmit}>
        <div className="form-group">
          <label className="control-label" htmlFor="date">
            Date
          </label>
          <input
            type="hidden"
            className="form-control"
            onChange={this.handleInputChange('date')}
            value={formatDate(this.state.date, 'MMM DD, YYYY')}
            onFocus={() => {
              this.datepicker && this.datepicker.showMonth(this.state.date)
            }}
          />
          <DayPicker
            ref={r => this.datepicker = r}
            initialMonth={new Date(this.state.date)}
            selectedDays={d => isSameDay(this.state.date, d)}
            onDayClick={(e, date) => this.setState({ date })}
            fixedWeeks
          />
        </div>

        <div className="form-group">
          <label className="control-label" htmlFor="mileage">
            Mileage
          </label>
          <input
            type="number"
            className="form-control"
            placeholder="E.g., 13,500"
            value={this.state.mileage}
            onChange={this.handleInputChange('mileage')}
            autoFocus
          />
        </div>

        {this.props.vehicle.enableCost ? (
          <div className="form-group">
            <label className="control-label" htmlFor="cost">
              Cost
            </label>
            <input
              type="text"
              className="form-control"
              placeholder="E.g., 90"
              value={this.state.cost}
              onChange={this.handleInputChange('cost')}
            />
          </div>
        ) : null}

        <div className="form-group">
          <label className="control-label" htmlFor="notes">
            Notes
          </label>
          <Textarea
            className="form-control"
            minRows={4}
            value={this.state.notes}
            onChange={this.handleInputChange('notes')}
            placeholder="E.g., Change oil, oil filter"
            required
          />
        </div>

        <button className="btn btn-success">Save</button>
      </form>
    )
  }

  renderEditForm() {
    return (
      <form onSubmit={this.handleSubmit}>
        <div className="row">
          <div className="col-sm-4">
            <div className="form-group">
              <label className="control-label" htmlFor="date">
                Date
              </label>
              <input
                type="hidden"
                className="form-control"
                onChange={this.handleInputChange('date')}
                value={formatDate(this.state.date, 'MMM DD, YYYY')}
              />
              <DayPicker
                ref={r => this.datepicker = r}
                initialMonth={new Date(this.state.date)}
                selectedDays={d => isSameDay(this.state.date, d)}
                onDayClick={(e, date) => this.setState({ date })}
                fixedWeeks
              />
            </div>

          </div>

          <div className="col-sm-8">
            <div className="form-group">
              <label className="control-label" htmlFor="mileage">
                Mileage
              </label>
              <input
                type="text"
                className="form-control"
                placeholder="E.g., 13,500"
                value={this.state.mileage}
                onChange={this.handleInputChange('mileage')}
              />
            </div>
            {this.props.vehicle.enableCost ? (
              <div className="form-group">
                <label className="control-label" htmlFor="cost">
                  Cost
                </label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="E.g., 90"
                  value={this.state.cost}
                  onChange={this.handleInputChange('cost')}
                />
              </div>
            ) : null}
            <div className="form-group">
              <label className="control-label" htmlFor="notes">
                Notes
              </label>
              <Textarea
                className="form-control"
                minRows={4}
                value={this.state.notes}
                onChange={this.handleInputChange('notes')}
                placeholder="E.g., Change oil, oil filter"
                required
              />
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-sm-12">
            <button className="btn btn-success">Save</button>

            {this.props.id && (
              <button className="btn btn-danger pull-right" onClick={this.handleDestroy}>
                Remove
              </button>
            )}
          </div>
        </div>
      </form>
    )
  }

  renderForm() {
    return this.props.id ? this.renderEditForm() : this.renderNewForm()
  }

  renderConfirmDestroy() {
    return (
      <form onSubmit={this.handleConfirmDestroy}>
        <div className="form-group">
          <p className="help-block">
            Are you sure you want to remove this record?
          </p>
        </div>

        <button className="btn btn-danger">
          Remove
        </button>
      </form>
    )
  }

  render() {
    return (
      <div>
        <ModalHeader title={this.state.modalTitle} onBack={this.state.modalBack}/>
        {this.state.confirmDestroy ? this.renderConfirmDestroy() : this.renderForm()}
      </div>
    )
  }
}

RecordForm.defaultProps = {
  date: new Date
}
