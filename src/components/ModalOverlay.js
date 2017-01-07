import React, { Component } from 'react'

const getOffset = (el) => {
  var box = el.getBoundingClientRect()

  var body = document.body
  var docEl = document.documentElement

  var scrollTop = window.pageYOffset || docEl.scrollTop || body.scrollTop
  var scrollLeft = window.pageXOffset || docEl.scrollLeft || body.scrollLeft

  var clientTop = docEl.clientTop || body.clientTop || 0
  var clientLeft = docEl.clientLeft || body.clientLeft || 0

  var top  = box.top +  scrollTop - clientTop
  var left = box.left + scrollLeft - clientLeft

  return {
    top: Math.round(top),
    left: Math.round(left)
  }
}

const getWindowBounds = () => {
  return {
    top: window.scrollY,
    left: window.scrollX,
    right: window.innerWidth,
    bottom: window.innerHeight,
  }
}

const getPosition = ({ el, style }, node = {}) => {
  const offset = getOffset(el)
  const bounds = getWindowBounds()

  let position = {
    ...offset,
    top: offset.top + el.offsetHeight + (style.top || 0),
    width: style.width || node.offsetWidth,
  }

  let nodeRightBound = position.left + position.width

  if (nodeRightBound > bounds.right) {
    position.left = offset.left - (position.width - el.offsetWidth)
  }

  return position
}

export default class ModalOverlay extends Component {
  constructor(props) {
    super(props)
    this.handleClose = this.handleClose.bind(this)

    this.state = {
      position: getPosition(this.props)
    }
  }

  componentDidMount() {
    let position = getPosition(this.props, this.content)
    this.setState({ position })
  }

  handleClose(e) {
    e.preventDefault()
    this.props.close()
  }

  render() {
    return (
      <div>
        <div className="pop-over-overlay" onClick={this.handleClose} />

        <div ref={r => this.content = r} className="pop-over" style={this.state.position}>
          {this.props.children}
        </div>
      </div>
    )
  }
}

ModalOverlay.defaultProps = {
  style: {}
}
