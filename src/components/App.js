import React, { Component } from 'react'
import { connect } from 'react-redux'
import Router from '../router'
import UpgradeBanner from './UpgradeBanner'

export class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      path: Router.getCurrentRoute()
    }
  }

  componentDidMount() {
    Router.onNavigate((nextPath, params) => {
      this.setState({ path: nextPath, params })
    })

    if (Router.getCurrentRoute() !== this.state.path) {
      this.setState({
        path: Router.getCurrentRoute()
      })
    }

    if (!this.isSignedIn()) {
      this.navigate('/')
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.state.session.authToken !== nextProps.state.session.authToken) {
      let route = this.getInitialRoute(nextProps)
      let currentRoute = Router.getCurrentRoute()

      if (currentRoute !== route) {
        this.navigate(route)
      }
    }
  }

  navigate(route) {
    Router.navigate(route, null, { replace: true })
  }

  getInitialRoute(props = this.props) {
    if (this.isSignedIn(props)) {
      return '/vehicles'
    } else {
      return '/'
    }
  }

  isSignedIn(props = this.props) {
    return props.state.session.authToken
  }

  render() {
    return (
      <div>
        <UpgradeBanner />
        <Router
          path={this.state.path}
          params={this.state.params}
        />
      </div>
    )
  }
}

export default connect((state) => ({state}))(App)
