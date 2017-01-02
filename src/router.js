import createRouter from './utils/createRouter'
import NotFound from './components/NotFound'
import Welcome from './components/Welcome'
import Login from './components/Login'
import Vehicles from './components/Vehicles'
import Vehicle from './components/Vehicle'

export default createRouter({
  '404': NotFound,

  '/': Welcome,
  '/login/:loginToken': Login,
  '/vehicles': Vehicles,
  '/vehicles/:id': Vehicle,
})
