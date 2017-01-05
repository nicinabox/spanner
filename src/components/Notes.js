import React, { Component } from 'react'
import marked from 'marked'

export default class Notes extends Component {
  constructor(props) {
    super(props)

    this.handleInputChange = this.handleInputChange.bind(this)
    this.handleNotesClick = this.handleNotesClick.bind(this)
    this.handleFormSubmit = this.handleFormSubmit.bind(this)

    this.state = {
      isEditing: false,
      notes: props.notes
    }
  }

  handleNotesClick() {
    this.setState({
      isEditing: true
    })
  }

  handleFormSubmit(e) {
    e.preventDefault()
    this.props.onSubmit(this.state.notes)
    this.setState({
      isEditing: false
    })
  }

  handleInputChange(name) {
    return (e) => this.setState({ [name]: e.target.value })
  }

  renderMarkdown() {
    return (
      <div onClick={this.handleNotesClick}>
        {this.state.notes ? (
          <div
            dangerouslySetInnerHTML={{
              __html: marked(this.state.notes)
            }}
          />
        ) : (
          <span className="text-muted">
            Add notes...
          </span>
        )}
      </div>
    )
  }

  renderForm() {
    return (
      <form onSubmit={this.handleFormSubmit}>
        <div className="form-group">
          <textarea
            className="form-control"
            rows={15}
            value={this.state.notes}
            onChange={this.handleInputChange('notes')}
          />
        </div>

        <button className="btn btn-success">
          Save
        </button>
        {' '}
        <a href="javascript:;"
          className="btn btn-secondary"
          onClick={() => this.setState({ isEditing: false })}>
          Cancel
        </a>
      </form>
    )
  }

  render() {
    return (
      <div id="vehicle-notes">
        {this.state.isEditing ? (
          this.renderForm()
        ) : (
          this.renderMarkdown()
        )}
      </div>
    )
  }
}
