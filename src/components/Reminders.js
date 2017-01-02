import React, { Component } from 'react'
import { connect } from 'react-redux'
import * as remindersActions from '../actions/remindersActions'

export class Reminders extends Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    this.props.fetchReminders(this.props.vehicleId)
  }

  render() {
    return (
      <div id="reminders">
        <h5>
          <span className="fa fa-clock-o fa-fw"></span>
          Reminders
        </h5>

        {this.props.state.reminders ? (
          <ul className="list-unstyled">
            {this.props.state.reminders.map(({notes}, i) => {
              return (
                <li key={i}>
                  <a href="#" className="js-reminder">
                    {notes}
                  </a>
                </li>
              )
            })}
          </ul>
        ) : (
          <span className="text-muted">No reminders set</span>
        )}
      </div>
    )
  }
}

export default connect((state, props) => ({
  state: {
    reminders: state.reminders[props.vehicleId] || props.reminders || []
  }
}), remindersActions)(Reminders)
