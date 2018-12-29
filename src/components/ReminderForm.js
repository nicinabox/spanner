import React, { Component } from 'react'
import { format as formatDate, addDays, addMonths, isSameDay } from 'date-fns'
import { pick } from 'lodash'
import DayPicker from 'react-day-picker'
import ModalHeader from './ModalHeader'
import handleInputChange from '../utils/handleInputChange'

const reminderOptions = [
  ['', 'Don\'t remind me'],
  ['date_or_mileage', 'Date or mileage, whichever is first'],
  ['date', 'On a date'],
  ['mileage', 'At a mileage'],
]

export default class ReminderForm extends Component {
  constructor(props) {
    super(props)

    this.handleInputChange = handleInputChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleDestroy = this.handleDestroy.bind(this)
    this.handleConfirmDestroy = this.handleConfirmDestroy.bind(this)
    this.handleCancelDestroy = this.handleCancelDestroy.bind(this)
    this.estimateReminderDate = this.estimateReminderDate.bind(this)

    this.defaultDate = addMonths(new Date(), 6)

    const initialState = props.id ? props : {
      notes: '',
      date: this.defaultDate,
      mileage: '',
      reminderType: '',
      reminderDate: null,
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

  estimateReminderDate() {
    const params = pick(this.state, 'mileage', 'date', 'reminderType')

    this.props.estimateReminderDate(
      this.props.vehicle.id,
      params
    )
    .then((resp) => {
      this.setState({
        reminderDate: resp.reminder_date
      })
    })
  }

  handleSubmit(e) {
    e.preventDefault()
    this.props.onSubmit(this.state)
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

  renderDateEstimate() {
    const { reminderType, reminderDate } = this.state

    if (reminderType === 'date' || !reminderDate) {
      return
    }

    return (
      `Estimated for ${formatDate(this.state.reminderDate, 'dddd MMM D, YYYY')}`
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
            placeholder="E.g., Change oil"
            value={this.state.notes}
            onChange={this.handleInputChange('notes')}
            autoFocus
            required
          />
        </div>

        <div className="form-group">
          <label className="control-label" htmlFor="reminder">Remind me</label>
          <select className="form-control" value={this.state.reminderType} onChange={this.handleInputChange('reminderType')}>
            {reminderOptions.map(([value, label], i) => (
              <option key={i} value={value}>{label}</option>
            ))}
          </select>
        </div>

        {/date/.test(this.state.reminderType) && (
          <div className="form-group">
            <label className="control-label" htmlFor="reminder">Date</label>
            <input
              type="hidden"
              name="date"
              className="form-control"
              value={formatDate(this.state.date, 'YYYY-MM-DD')}
              onChange={this.handleInputChange('date')}
            />

            <DayPicker
              ref={r => this.datepicker = r}
              initialMonth={this.state.date ? new Date(this.state.date) : new Date}
              selectedDays={d => isSameDay(this.state.date, d)}
              onDayClick={(e, date) => this.setState({ date }, this.estimateReminderDate)}
              fixedWeeks
            />
          </div>
        )}

        {/mileage/.test(this.state.reminderType) && (
          <div className="form-group">
            <label className="control-label" htmlFor="reminder">Mileage</label>
            <input
              type="number"
              name="mileage"
              className="form-control"
              value={this.state.mileage}
              onChange={this.handleInputChange('mileage', this.estimateReminderDate)}
            />
          </div>
        )}

        <small className="help-block">
          {this.renderDateEstimate()}
        </small>

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
