import React from 'react'
import Modal from './Modal'

export default function ModalHeader (props) {
  const handleClose = () => {
    Modal.close()
  }

  return (
    <header className="pop-over-header">
      {props.onBack ? (
        <a href="javascript:;" onClick={props.onBack} className="back">
          <i className="fa fa-angle-left"></i>
        </a>
      ) : null}

      <h4>{props.title}</h4>

      <a href="javascript:;" className="close" onClick={handleClose}>&times;</a>
    </header>
  )
}

ModalHeader.defaultProps = {
  back: false,
}
