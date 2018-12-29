export default function handleInputChange (name, cb) {
  return (e) => {
    let state = { [name]: e.target.value }

    if (e.target.type === 'checkbox') {
      state = {
        [name]: !this.state[name],
      }
    }

    this.setState(state, cb)
  }
}
