import { createElement } from 'react'
import UrlPattern from 'url-pattern'

const origin = window.location.origin
let navigationHandlers = []
let boundNode = null

const isSameOrigin = (url) => url.indexOf(origin) === 0
const getCurrentRoute = () => window.location.pathname

const tryParseJSON = (data) => {
  try {
    return JSON.parse(data)
  } catch (e) {}
}

const matchRoute = (path, patterns) => {
  return patterns.map((p) => {
    let params = p.pattern.match(path)
    if (params) {
      return { ...p, params }
    }
  }).filter(f => f)[0]
}

const createPatterns = (routes) => {
  const paths = Object.keys(routes)

  return paths.map((path) => ({
    path,
    component: routes[path],
    pattern: new UrlPattern(path)
  }))
}

const resolveNavigationHandlers = (url, params) => {
  let path = url.replace(origin, '')
  window.scrollTo(0, 0)
  navigationHandlers.reverse().forEach(handler => handler(path, params))
}

const navigate = (path, params = {}, options = {}) => {
  let method = options.replace ? 'replaceState' : 'pushState'

  window.history[method](params, '', path)
  resolveNavigationHandlers(path, params)
}

const onNavigate = (cb) => {
  bindEvents(window)
  navigationHandlers.push((...args) => cb.apply(null, args))
}

const bindEvents = (node) => {
  if (boundNode === node) return
  if (boundNode !== null) unbindEvents(boundNode)

  node.addEventListener('click', handleClick)
  node.addEventListener('popstate', handlePopState)
  boundNode = node
}

const unbindEvents = (node) => {
  node.removeEventListener('click', handleClick)
  node.removeEventListener('popstate', handlePopState)
}

const handlePopState = () => resolveNavigationHandlers(window.location.pathname)

const handleClick = (e) => {
  if (e.button !== 0 || e.altKey || e.ctrlKey || e.metaKey || e.shiftKey || e.defaultPrevented) {
    return
  }

  let depth = 10
  let node = e.target

  while(node && --depth) {
    if (node.nodeName == 'A') {
      if (isSameOrigin(node.href) && node.href.indexOf('#') === -1) {
        if (node.dataset.noBind) return

        e.preventDefault()
        navigate(node.href, tryParseJSON(node.dataset.props))
      }

      return
    }

    node = node.parentNode
  }
}

export default function createRouter (routes) {
  const patterns = createPatterns(routes)

  const Router = ({ path, props }) => {
    const { component, params } = matchRoute(path, patterns) || { component: routes[404] }
    return createElement(component, { ...props, params })
  }

  Router.onNavigate = onNavigate
  Router.navigate = navigate
  Router.getCurrentRoute = getCurrentRoute

  return Router
}
