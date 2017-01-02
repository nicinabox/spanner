import React, { Component } from 'react'
import { connect } from 'react-redux'
import { sample } from 'lodash'
import * as sessionActions from '../actions/sessionActions'
import Router from '../router'

class Welcome extends Component {
  constructor(props) {
    super(props)

    this.handleInputChange = this.handleInputChange.bind(this)
    this.handleFormSubmit = this.handleFormSubmit.bind(this)
    this.handleResetForm = this.handleResetForm.bind(this)

    this.state = {
      isPending: false,
      email: '',
    }
  }

  componentDidMount() {
    if (this.isSignedIn()) {
      return Router.navigate('/vehicles', { replace: true })
    }
  }

  isSignedIn(props = this.props) {
    return props.state.session.authToken
  }

  getPlaceholder() {
    return sample([
      'lando@cloudci.ty',
      'robertpaulson@loustave.rn',
      'drspaceman@rockefellerpla.ce',
      'mal@firef.ly',
    ])
  }

  handleFormSubmit(e) {
    e.preventDefault()

    this.setState({ isPending: true })
    this.props.requestSession(this.state.email)
  }

  handleInputChange(name) {
    return (e) => {
      this.setState({ [name]: e.currentTarget.value })
    }
  }

  handleResetForm(e) {
    e.preventDefault()

    this.setState({
      isPending: false
    })
  }

  render() {
    return (
      <div id="main">
        <div className="container">
          <div className="row text-center">
            <div className="col-sm-10 col-sm-offset-1">
              <h2>
                <strong>
                  The easiest way keep service records for all your vehicles
                </strong>
              </h2>
              <p className="lead">
                Keeping useful maintenance records is a hassle, so most folks don't bother.
                <br />
                Spanner lets you keep records in a natural way.
              </p>
            </div>
          </div>

          <div className="row text-center">
            <div className="col-sm-6 col-sm-offset-3">
              {this.state.isPending ? (
                <h4 className="text-success">
                  <i className="fa fa-check"></i>
                  Check your email for a Sign In button.
                  <br/>
                  <a href="#" className="try-again" onClick={this.handleResetForm}>Try again.</a>
                </h4>
              ) : (
                <form className="form-inline" onSubmit={this.handleFormSubmit}>
                  <div className="form-group">
                    <input
                      id="email"
                      name="email"
                      type="email"
                      className="form-control"
                      value={this.state.email}
                      placeholder={this.getPlaceholder()}
                      onChange={this.handleInputChange('email')}
                      autoFocus={true} />
                    </div>

                    <button className="btn btn-primary">Sign In</button>

                    <p className="help-block">
                      <small className="text-muted">
                        First time? We'll setup your account automagically.
                      </small>
                    </p>
                  </form>
                )}
              </div>
            </div>
          </div>
      </div>
    )
  }
}

export default connect((state) => ({state}), sessionActions)(Welcome)
