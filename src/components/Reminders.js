import React, { Component } from 'react'
import { connect } from 'react-redux'
import { format as formatDate } from 'date-fns'
import * as remindersActions from '../actions/remindersActions'
import ReminderForm from './ReminderForm'
import Modal from './Modal'

export class Reminders extends Component {
  constructor(props) {
    super(props)
    this.handleReminderClick = this.handleReminderClick.bind(this)
  }

  componentDidMount() {
    this.props.fetchReminders(this.props.vehicleId)
  }

  handleReminderClick(e, reminder) {
    Modal.open({
      el: e.currentTarget,
      children: <ReminderForm
        {...reminder}
        vehicle={this.props.state.vehicle}
        onSubmit={(props) => {
          this.props.updateReminder(this.props.vehicleId, props.id, props)
          Modal.close()
        }}
        onConfirmDestroy={(id) => {
          this.props.destroyReminder(this.props.vehicleId, id)
          Modal.close()
        }} />
    })
  }

  render() {
    return (
      <div id="reminders" className="content-section">
        <h4>
          <span className="fa fa-clock-o fa-fw"></span>
          Reminders
        </h4>

        {this.props.state.reminders.length ? (
          <ul className="list-unstyled">
            {this.props.state.reminders.map((reminder, i) => {
              return (
                <li key={i}>
                  <a href="javascript:;" onClick={(e) => this.handleReminderClick(e, reminder)}>
                    <strong>
                      {reminder.notes}
                    </strong>
                    <span className="text-muted pull-right">
                      {formatDate(reminder.date, 'MMM D, YYYY')}
                    </span>
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
    vehicle: state.vehicles.find(v => v.id === +props.vehicleId) || {},
    reminders: state.reminders[props.vehicleId] || props.reminders || []
  }
}), remindersActions)(Reminders)
