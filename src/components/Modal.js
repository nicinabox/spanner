import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import elementClass from 'element-class'
import ModalOverlay from './ModalOverlay'

const renderModal = (node, props) => {
  elementClass(document.body).add('pop-over-open')
  return ReactDOM.render(<ModalOverlay {...props} />, node)
}

export default function Modal () { return null }

Modal.open = function (props = {}) {
  this.node = document.createElement('div')
  this.node.className = 'pop-over-container'
  document.body.appendChild(this.node)

  renderModal(this.node, {
    ...props,
    close: this.close.bind(this)
  })
}

Modal.close = function () {
  ReactDOM.unmountComponentAtNode(this.node)
  document.body.removeChild(this.node)
  elementClass(document.body).remove('pop-over-open')
}
