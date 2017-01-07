import React, { Component } from 'react'
import { format as formatDate, addDays, isSameDay } from 'date-fns'
import { pick } from 'lodash'
import DayPicker from 'react-day-picker'
import ModalHeader from './ModalHeader'

export default class ReminderForm extends Component {
  constructor(props) {
    super(props)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleDestroy = this.handleDestroy.bind(this)
    this.handleConfirmDestroy = this.handleConfirmDestroy.bind(this)
    this.handleCancelDestroy = this.handleCancelDestroy.bind(this)
    this.handleInputChange = this.handleInputChange.bind(this)

    let initialState = props.id ? props : {
      notes: '',
      date: addDays(new Date, 1),
      mileage: '',
      reminderType: '',
    }

    this.state = {
      ...initialState,
      modalTitle: this.getModalTitle(props),
      modalBack: false
    }
  }

  getModalTitle(props = this.props) {
    return props.id ? 'Edit Reminder' : 'Add Reminder'
  }

  handleSubmit(e) {
    e.preventDefault()
    let props = pick(this.state, 'id', 'notes', 'date', 'mileage', 'reminderType')
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

  renderConfirmDestroy() {
    return (
      <form onSubmit={this.handleConfirmDestroy} className={this.state.error && 'has-error'}>
        <div className="form-group">
          <p className="help-block">
            Are you sure you want to remove this reminder?
          </p>
        </div>

        <button className="btn btn-danger">
          Remove
        </button>
      </form>
    )
  }

  estimateDate(mileage) {
    if (this.props.mileage && this.state.mileage === this.props.mileage) {
      return this.props.date
    }

    let { estimatedMileage, milesPerDay } = this.props.vehicle

    let days = (mileage - estimatedMileage) / milesPerDay
    return addDays(new Date, days)
  }


  renderDateEstimate() {
    if (!this.state.mileage) return
    let estimatedDate = this.estimateDate(this.state.mileage)

    if (estimatedDate < new Date) {
      return (
        'Enter a mileage higher than your current mileage.'
      )
    }

    return (
      `Estimated for ${formatDate(estimatedDate, 'dddd MMM D, YYYY')}`
    )
  }

  renderForm() {
    return (
      <form onSubmit={this.handleSubmit}>
        <div className="form-group">
          <label className="control-label" htmlFor="reminder">Note</label>
          <input
            type="text"
            className="form-control"
            name="notes"
            placeholder="E.g., Change oil at 60,000"
            value={this.state.notes}
            onChange={this.handleInputChange('notes')}
            autoFocus
            required
          />
        </div>

        <div className="form-group">
          <label className="control-label" htmlFor="reminder">Remind me</label>
          <select className="form-control" value={this.state.reminderType} onChange={this.handleInputChange('reminderType')}>
            <option value="">Don't remind me</option>
            <option value="date">On a date</option>
            <option value="mileage">At a mileage</option>
          </select>
        </div>

        {this.state.reminderType === 'date' ? (
          <div className="form-group">
            <label className="control-label" htmlFor="reminder">Date</label>
            <input
              type="hidden"
              name="date"
              className="form-control"
              value={formatDate(this.state.date, 'MMM DD, YYYY')}
              onChange={this.handleInputChange('date')}
            />

            <DayPicker
              ref={r => this.datepicker = r}
              initialMonth={new Date(this.state.date)}
              selectedDays={d => isSameDay(this.state.date, d)}
              onDayClick={(e, date) => this.setState({ date })}
              fixedWeeks
            />

            <small className="help-block">
              You'll get a reminder email on this day
            </small>
          </div>
        ) : null}

        {this.state.reminderType === 'mileage' ? (
          <div className="form-group">
            <label className="control-label" htmlFor="reminder">Mileage</label>
            <input
              type="text"
              name="mileage"
              className="form-control"
              value={this.state.mileage}
              onChange={this.handleInputChange('mileage')}
            />

            <small className="help-block">
              {this.renderDateEstimate()}
            </small>
          </div>
        ) : null}

        <button className="btn btn-success">Save</button>

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
        <ModalHeader title={this.state.modalTitle} onBack={this.state.modalBack} />
        {this.state.confirmDestroy ? this.renderConfirmDestroy() : this.renderForm()}
      </div>
    )
  }
}

ReminderForm.defaultProps = {
  date: new Date
}
