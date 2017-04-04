import React, { Component, PropTypes } from 'react'
import ModalHeader from './ModalHeader'
import VehicleForm from './VehicleForm'
import handleInputChange from '../utils/handleInputChange'

export default class VehicleMenu extends Component {
  constructor(props) {
    super(props)

    this.handleInputChange = handleInputChange.bind(this)
    this.handleEditClick = this.handleEditClick.bind(this)
    this.handleExportClick = this.handleExportClick.bind(this)
    this.handleImportClick = this.handleImportClick.bind(this)
    this.handleImport = this.handleImport.bind(this)

    this.state = {
      path: ''
    }
  }

  handleEditClick(e) {
    this.setState({ path: 'edit' })
  }

  handleExportClick(e) {
    this.props.exportRecords(this.props.vehicle.id)
      .then((blob) => {
        let link = document.createElement('a')
        link.href = URL.createObjectURL(blob)
        link.setAttribute('download', this.props.vehicle.name + '.csv')
        link.click()
      })
  }

  handleImportClick(e) {
    this.setState({ path: 'import' })
  }

  handleImport(e) {
    e.preventDefault()
    this.props.importRecords(this.props.vehicle.id, {
      importFile: this.state.importFile,
      fuelly: this.state.fuelly,
    })
    .then(() => {
      this.props.fetchRecords(this.props.vehicle.id)
    })
  }

  renderImport() {
    return (
      <div>
        <ModalHeader title="Import Records" onBack={() => this.setState({ path: '' })} />
        <form action="" onSubmit={this.handleImport}>
          <div className="alert alert-info">
            <p>
              Import from a CSV with the headers{' '}
              <strong>date</strong>, <strong>cost</strong>, <strong>mileage</strong>, <strong>notes</strong>.
            </p>
          </div>

          <div className="form-group">
            <label className="control-label" htmlFor="importFile">
              Import a CSV
            </label>
            <input
              type="file"
              id="importFile"
              className="form-control"
              onChange={(e) => {
                this.setState({ importFile: e.target.files[0] })
              }}
            />
          </div>

          <div className="form-group">
            <label className="control-label" htmlFor="fuelly">
              <input
                id="fuelly"
                type="checkbox"
                checked={this.state.fuelly}
                onChange={this.handleInputChange} />{' '}
              This data is from Fuelly
            </label>
          </div>
          <button type="submit" className="btn btn-success">
            Import
          </button>
        </form>
      </div>
    )
  }

  renderEdit() {
    return (
      <div>
        <ModalHeader title="Edit Vehicle" onBack={() => this.setState({ path: '' })} />
        <VehicleForm
          {...this.props.vehicle}
          onSubmit={(params) => {
            this.props.updateVehicle(params.id, params)
            .then(() => Modal.close())
          }}
          onConfirmDestroy={(id) => {
            this.props.destroyVehicle(id)
            .then(() => {
              Modal.close()
              Router.navigate('/vehicles')
            })
          }}
        />
      </div>
    )
  }

  renderMenu() {
    return (
      <div>
        <ul className="nav nav-pills nav-stacked">
          <li><a href="javascript:;" onClick={this.handleEditClick}>Edit</a></li>
          <li><a href="javascript:;" onClick={this.handleExportClick}>Export</a></li>
          <li><a href="javascript:;" onClick={this.handleImportClick}>Import</a></li>
        </ul>
      </div>
    )
  }

  render() {
    switch (this.state.path) {
      case 'edit':
        return this.renderEdit()

      case 'import':
        return this.renderImport()

      default:
        return this.renderMenu()
    }
  }
}

VehicleMenu.propTypes = {
}
