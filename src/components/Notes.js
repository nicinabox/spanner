import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import marked from 'marked'
import Textarea from 'react-textarea-autosize'

export default class Notes extends Component {
  constructor(props) {
    super(props)

    this.app = document.getElementById('root')

    this.handleInputChange = this.handleInputChange.bind(this)
    this.handleNotesClick = this.handleNotesClick.bind(this)
    this.handleFormSubmit = this.handleFormSubmit.bind(this)
    this.handleDocumentClick = this.handleDocumentClick.bind(this)
    this.handleCancel = this.handleCancel.bind(this)

    this.state = {
      isEditing: false,
      notes: props.notes || ''
    }
  }

  componentDidMount() {
    this.app.addEventListener('click', this.handleDocumentClick)
  }

  componentWillUnmount() {
    this.app.removeEventListener('click', this.handleDocumentClick)
  }

  handleDocumentClick(e) {
    const form = ReactDOM.findDOMNode(this.editingForm)

    if (form && !form.contains(e.target)) {
      this.handleCancel()
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

  handleCancel() {
    if (this.props.notes !== this.state.notes) {
      let answer = confirm('You have unsaved changes. Do you want to abandon them?')
      if (!answer) return
    }

    this.setState({
      isEditing: false,
      notes: this.props.notes,
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
      <form
        ref={r => this.editingForm = r}
        onSubmit={this.handleFormSubmit}>
        <div className="form-group">
          <Textarea
            className="form-control"
            minRows={4}
            maxRows={15}
            value={this.state.notes}
            onChange={this.handleInputChange('notes')}
            autoFocus
          />
        </div>

        <button className="btn btn-success">
          Save
        </button>
        {' '}
        <a href="javascript:;"
          className="btn btn-secondary"
          onClick={this.handleCancel}>
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
