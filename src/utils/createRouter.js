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

const resolveNavigationHandlers = (url, params) => {
  let path = url.replace(origin, '')
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
        navigate(node.href, JSON.parse(node.dataset.params))
      }

      return
    }

    node = node.parentNode
  }
}

const Route = (routes, patterns) => ({ path, onEnter, params }) => {
  const route = matchRoute(path, patterns)
  const Component = route ? route.component : routes[404]
  const props = {
    ...params,
    params: (route || {}).params
  }

  console.log(props);

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
