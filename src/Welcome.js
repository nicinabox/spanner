import React, { Component } from 'react'

class Welcome extends Component {
  constructor(props) {
    super(props)

    this.state = {
      isPending: false
    }
  }

  getPlaceholder() {
    return ''
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
                  Check your email for a link.

                  <a href="#" className="try-again">Try again.</a>
                </h4>
              ) : (
                <form className="form-inline">
                  <div className="form-group">
                    <input
                      id="email"
                      name="email"
                      type="email"
                      className="form-control"
                      value={this.state.email}
                      placeholder={this.getPlaceholder()}
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

export default Welcome
