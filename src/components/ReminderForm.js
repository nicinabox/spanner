import React, { Component } from 'react'
import { format as formatDate } from 'date-fns'

export default class ReminderForm extends Component {
  constructor(props) {
    super(props)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleDestroy = this.handleDestroy.bind(this)
    this.handleInputChange = this.handleInputChange.bind(this)

    this.state = {}
  }

  handleSubmit(e) {
    e.preventDefault()
    console.log(this.state);
  }

  handleDestroy(e) {
    e.preventDefault()
    console.log('destroy');
  }

  handleInputChange(name) {
    return (e) => this.setState({ [name]: e.target.value })
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <div className="form-group">
          <label className="control-label" htmlFor="reminder">Note</label>
          <input
            type="text"
            className="form-control"
            name="notes"
            placeholder="E.g., Change oil at 60,000"
            value={this.props.notes}
            onChange={this.handleInputChange('notes')}
            autoFocus
            required />
        </div>

        <div className="form-group">
          <label className="control-label" htmlFor="reminder">Date</label>
          <input
            type="text"
            name="date"
            className="form-control"
            value={formatDate(this.props.date, 'MMM DD, YYYY')}
            onChange={this.handleInputChange('date')} />

            <small className="help-block">
              You'll get a reminder email on this day
            </small>
        </div>

        <button className="btn btn-success">Save</button>
      </form>
    )
  }
}

ReminderForm.defaultProps = {
  date: new Date
}
