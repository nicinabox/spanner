import React, { Component } from 'react'
import { connect } from 'react-redux'
import { sortBy } from 'lodash'
import { format as formatDate } from 'date-fns'
import * as recordsActions from '../actions/recordsActions'

export class Records extends Component {
  constructor(props) {
    super(props)

    this.state = {
      years: this.getSections(props),
      records: this.groupByDate(props.state.records)
    }
  }

  componentDidMount() {
    this.props.fetchRecords(this.props.vehicleId)
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      years: this.getSections(nextProps),
      records: this.groupByDate(nextProps.state.records)
    })
  }

  getDataSource(rows, sections) {
    if (!sections) sections = Object.keys(rows)

    return {
      sections: sections,
      rows: rows
    }
  }

  getSections(props = this.props) {
    let blob = this.groupByDate(props.state.records)
    return Object.keys(blob).sort((a, b) => b - a)
  }

  groupByDate(records) {
    return sortBy(records, 'date').reverse()
      .reduce((result, record) => {
        let date = new Date(record.date).getFullYear()

        result[date] = (result[date] || []).concat(record)
        return result
      }, {})
  }


  render() {
    let { records, years } = this.state

    return (
      <div id="records">
        {!years.length && (
          <div className="no-results">
            <h3>You don't have any records yet.</h3>
            <p>
              Try adding your purchase as the first one.
            </p>
          </div>
        )}

        {years.map((year) => {
          return (
            <div className="record-year" key={year}>
              <h3>{year}</h3>
              <div className="records-container hidden-sm hidden-xs">
                <table className="table table-striped">
                  <tbody>
                    {records[year].map((record, i) => {
                      return (
                        <tr className="record" data-id={record.id} key={i}>
                          <td className="date">{formatDate(record.date, 'MMM DD')}</td>
                          <td className="mileage">{record.mileage.toLocaleString()}</td>

                          {this.props.state.vehicle.enableCost && (
                            <td className="cost">{record.cost}</td>
                          )}

                          <td className="notes">{record.notes}</td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )
        })}
      </div>
    )
  }
}

export default connect((state, props) => ({
  state: {
    vehicle: state.vehicles.find(v => v.id === props.vehicleId) || {},
    records: state.records[props.vehicleId] || []
  }
}), recordsActions)(Records)
