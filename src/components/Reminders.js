import React, { Component } from 'react'
import { connect } from 'react-redux'
import { format as formatDate, isTomorrow, isToday } from 'date-fns'
import classNames from 'classnames'
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
        estimateReminderDate={this.props.estimateReminderDate}
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
          <ul className="nav">
            {this.props.state.reminders.map((reminder, i) => {
              let className = classNames({
                'reminder-date-overdue': reminder.reminderDate && new Date(reminder.reminderDate) < new Date,
                'reminder-date-soon': isTomorrow(reminder.reminderDate) || isToday(reminder.reminderDate)
              })

              return (
                <li key={i} className={className}>
                  <a href="javascript:;" onClick={(e) => this.handleReminderClick(e, reminder)} className="clearfix">
                    <span className="reminder-notes">
                      {reminder.notes}
                    </span>
                    {reminder.reminderDate ? (
                      <span className="reminder-date">
                        {formatDate(reminder.reminderDate, 'MMM D, YYYY')}
                      </span>
                    ) : null}
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
