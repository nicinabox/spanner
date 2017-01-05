import React, { Component } from 'react'
import { format as formatDate, addDays } from 'date-fns'
import { pick } from 'lodash'
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
    let props = pick(this.state, 'id', 'notes', 'date')
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
    console.log(this.props);
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
          <label className="control-label" htmlFor="reminder">Date</label>
          <input
            type="text"
            name="date"
            className="form-control"
            value={formatDate(this.state.date, 'MMM DD, YYYY')}
            onChange={this.handleInputChange('date')}
          />

          <small className="help-block">
            You'll get a reminder email on this day
          </small>
        </div>

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
