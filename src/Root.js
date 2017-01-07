import React, { Component } from 'react'
import { Provider } from 'react-redux'
import createStore from './store'
import { getItem } from './utils/storage'
import App from './components/App'

class Root extends Component {
  constructor(props) {
    super(props)

    this.state = {
      isLoaded: false,
    }
  }

  componentDidMount() {
    getItem('store').then((store) => {
      this.store = createStore(store || {})
      this.setState({ isLoaded: true })
    })
  }

  render() {
    if (!this.store) return null
    return (
      <Provider store={this.store}>
        <App />
      </Provider>
    )
  }
}

export default Root
