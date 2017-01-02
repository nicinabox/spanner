import { createElement } from 'react'
import UrlPattern from 'url-pattern'

const origin = window.location.origin

const isSameOrigin = (url) => {
  return url.indexOf(origin) === 0
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

let navigationHandlers = []
let boundNode = null

const resolveNavigationHandlers = (path) => {
  navigationHandlers.reverse().forEach(handler => handler(path))
}

const navigate = (path, options = {}) => {
  let method = options.replace ? 'replaceState' : 'pushState'

  process.nextTick(() => {
    window.history[method]({}, '', path)
    resolveNavigationHandlers(path)
  })
}

const onNavigate = (cb) => {
  bindEvents(window)
  navigationHandlers.push((path) => cb(path))
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

const handlePopState = () => {
  resolveNavigationHandlers(window.location.pathname)
}

const handleClick = (e) => {
  if (e.button !== 0 || e.altKey || e.ctrlKey || e.metaKey || e.shiftKey || e.defaultPrevented) {
    return
  }

  let depth = 10
  let node = e.target

  while(node && --depth) {
    if (node.nodeName == 'A') {
      if (isSameOrigin(node.href)) {
        e.preventDefault()
        navigate(node.href)
      }

      return
    }

    node = node.parentNode
  }
}

const Route = (routes, patterns) => ({ path, onEnter }) => {
  const route = matchRoute(path, patterns)
  const Component = route ? route.component : routes[404]
  const props = { params: (route || {}).params }

  onEnter(Component)

  return createElement(Component, props)
}

export default function createRouter (routes) {
  const patterns = createPatterns(routes)
  const Router = Route(routes, patterns)

  Router.onNavigate = onNavigate
  Router.navigate = navigate

  return Router
}
