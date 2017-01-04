import React, { Component } from 'react'
import { format as formatDate } from 'date-fns'

export default class RecordForm extends Component {
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
          <label className="control-label" htmlFor="date">
            Date
          </label>
          <input type="text"
            className="form-control"
            onChange={this.handleInputChange('date')}
            value={formatDate(this.props.date, 'MMM DD, YYYY')} />
        </div>

        <div className="form-group">
          <label className="control-label" htmlFor="mileage">
            Mileage
          </label>
          <input
            type="text"
            className="form-control"
            placeholder="E.g., 13,500"
            value={this.props.mileage}
            onChange={this.handleInputChange('mileage')}
            autoFocus />
        </div>

        <div className="form-group">
          <label className="control-label" htmlFor="notes">
            Notes
          </label>
          <textarea
            className="form-control"
            value={this.props.notes}
            onChange={this.handleInputChange('notes')}
            placeholder="E.g., Change oil, oil filter"></textarea>
        </div>

        <button className="btn btn-success">Save</button>
      </form>
    )
  }
}

RecordForm.defaultProps = {
  date: new Date
}
