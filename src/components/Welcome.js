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
      return Router.navigate('/vehicles', null, { replace: true })
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
      <div id="welcome">
        <div id="main">
          <div className="section section-purple">
            <div className="container">
              <div className="row text-center">
                <div className="col-sm-10 col-sm-offset-1">
                  <a href="/" id="logo">
                    <img src="/assets/logo-white.png" alt=""/>
                  </a>

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
                <div className="col-md-6 col-md-offset-3">
                  <div id="sign-in">
                    {this.state.isPending ? (
                      <div>
                        <h4>
                          <i className="fa fa-check"></i>{' '}
                          Check your email for a Sign In button.
                        </h4>
                        <a href="#" className="try-again btn btn-text" onClick={this.handleResetForm}>
                          Try again
                        </a>
                      </div>
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
                            autoFocus={true}
                          />
                        </div>
                        {' '}
                        <button className="btn btn-success">Sign In</button>

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

              <div className="row">
                <div className="teaser-img">
                  <img src="/assets/teaser-vehicle.png" alt="" className="img-responsive"/>
                </div>
              </div>
            </div>
          </div>

          <div className="section">
            <div className="container">
              <div className="row">
                <div className="col-sm-5">
                  <h3>
                    <strong>
                      With predictive mileage, adding new service is dead easy.
                    </strong>
                  </h3>
                  <p>
                    By tracking the frequency and mileage of your records we can predict the mileage for your next service, making it even easier to keep records.
                  </p>
                </div>
                <div className="col-sm-7">
                  <img src="/assets/teasers/new-record.png" alt="New Record" className="img-responsive pull-right"/>
                </div>
              </div>
            </div>
          </div>

          <div className="section section-purple">
            <div className="container">
              <div className="row">
                <div className="col-sm-6">
                  <img src="/assets/teasers/new-reminder-purple.png" alt="New Reminder" className="img-responsive pull-right"/>
                </div>
                <div className="col-sm-6">
                  <h3>
                    <strong>
                      Get reminders on a date or at a mileage.
                    </strong>
                  </h3>
                  <p>
                    It's hard to pinpoint the date of your next oil change, tire rotation, or brake flush. We analyze your mileage and send you a reminder when your service is coming up.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="section">
            <div className="container">
              <div className="row">
                <div className="col-sm-6">
                  <h3>
                    <strong>
                      With Notes you can keep track of anything related to your vehicle.
                    </strong>
                  </h3>
                  <p>
                    Every vehicle has it's quirks, like how to change the clock or an awkward reset procedure.{' '}
                    Notes are a perfect place to jot this down, as well as things like common torque measurments or planned upgrades.
                  </p>
                </div>
                <div className="col-sm-6">
                  <div className="teaser-img">
                    <img src="/assets/teasers/notes.png" alt="Notes" className="img-responsive" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="section section-purple">
            <div className="container">
              <div className="row">
                <div className="col-sm-12 text-center">
                  <h3>
                    <strong>
                      Lower your insurance rate by reporting how much you really drive.
                    </strong>
                  </h3>
                  <p>
                    If you drive significantly less than the national average you could be eligible discount on your insurance.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="section section-bordered">
            <div className="container">
              <div className="row">
                <div className="col-sm-6 text-center">
                  <h3>
                    <strong>
                      Download for iOS
                    </strong>
                  </h3>
                  <br/>
                  <p>
                    <a href="https://itunes.apple.com/us/app/spanner/id1187772916?ls=1&mt=8">
                      <img src="/assets/appstore.svg" alt="" height="50"/>
                    </a>
                  </p>
                </div>
                <div className="col-sm-6">
                  <div className="teaser-img">
                    <img src="/assets/teasers/iphone.png" alt=""  className="img-responsive" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="section">
            <div className="container">
              <p>Made with all the ♥ in the world by <a href="https://twitter.com/nicinabox">@nicinabox</a></p>
              <p>
                <a href="/terms" data-no-bind>Terms & Privacy</a>
              </p>
            </div>
          </div>

        </div>
      </div>
    )
  }
}

export default connect((state) => ({state}), sessionActions)(Welcome)
