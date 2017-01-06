import { createElement } from 'react'
import UrlPattern from 'url-pattern'

const origin = window.location.origin
let navigationHandlers = []
let boundNode = null

const isSameOrigin = (url) => url.indexOf(origin) === 0

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

  process.nextTick(() => {
    window.history[method](params, '', path)
    resolveNavigationHandlers(path, params)
  })
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

const parseData = (node) => {
  try {
    return JSON.parse(node.dataset.props)
  } catch (e) {}
}

const handleClick = (e) => {
  if (e.button !== 0 || e.altKey || e.ctrlKey || e.metaKey || e.shiftKey || e.defaultPrevented) {
    return
  }

  let depth = 10
  let node = e.target

  while(node && --depth) {
    if (node.nodeName == 'A') {
      if (isSameOrigin(node.href) && node.href.indexOf('#') === -1) {
        e.preventDefault()
        navigate(node.href, parseData(node))
      }

      return
    }

    node = node.parentNode
  }
}

const getCurrentRoute = () => {
  return window.location.pathname
}

const Route = (routes, patterns) => ({ path, props }) => {
  const route = matchRoute(path, patterns)
  const Component = route ? route.component : routes[404]

  return createElement(Component, {
    ...props,
    params: (route || {}).params
  })
}

export default function createRouter (routes) {
  const patterns = createPatterns(routes)
  const Router = Route(routes, patterns)

  Router.onNavigate = onNavigate
  Router.navigate = navigate
  Router.getCurrentRoute = getCurrentRoute

  return Router
}
