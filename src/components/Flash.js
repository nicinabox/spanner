import React from 'react'
import ReactDOM from 'react-dom'
import elementClass from 'element-class'

const renderModal = (node, props) => {
  elementClass(document.body).add('flash-open')
  return ReactDOM.render(<FlashOverlay {...props} />, node)
}

function FlashOverlay (props) {
  return (
    <div className={`alert alert-${props.type}`} onClick={() => Flash.close()}>
      <p>{props.message}</p>
    </div>
  )
}

FlashOverlay.defaultProps = {
  message: '',
  type: 'warning'
}

export default function Flash () { return null }

Flash.open = function (props = {}) {
  this.node = this.node || document.createElement('div')
  this.node.className = 'flash-container'
  document.body.appendChild(this.node)

  renderModal(this.node, {
    ...props,
    close: this.close.bind(this)
  })
}

Flash.close = function () {
  if (!this.node) return
  ReactDOM.unmountComponentAtNode(this.node)
  document.body.removeChild(this.node)
  elementClass(document.body).remove('flash-open')
  this.node = null
}
