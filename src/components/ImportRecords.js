import React, { Component, PropTypes } from 'react'
import handleInputChange from '../utils/handleInputChange'

export default class ImportRecords extends Component {
  constructor(props) {
    super(props)

    this.handleInputChange = handleInputChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)

    this.state = {}
  }

  handleSubmit(e) {
    e.preventDefault()
    this.props.onSubmit(this.state)
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        {!this.state.fuelly && (
          <div className="alert alert-info">
            <p>
              Import from a CSV with the headers <strong>date</strong>, <strong>cost</strong>, <strong>mileage</strong>, <strong>notes</strong>.
            </p>
          </div>
        )}

        <div className="form-group">
          <label className="control-label" htmlFor="importFile">
            Import a CSV
          </label>
          <input
            type="file"
            id="importFile"
            className="form-control"
            onChange={(e) => {
              this.setState({ importFile: e.target.files[0] })
            }}
          />
        </div>

        <div className="form-group">
          <label className="control-label" htmlFor="fuelly">
            <input
              id="fuelly"
              type="checkbox"
              checked={this.state.fuelly}
              onChange={this.handleInputChange('fuelly')} />{' '}
            This data is from Fuelly
          </label>
        </div>

        <p className="text-danger">
          Importing will replace all your existing records for this vehicle!
        </p>

        <button type="submit" className="btn btn-success">
          Import
        </button>
      </form>
    )
  }
}

ImportRecords.propTypes = {
}
