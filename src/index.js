import React from 'react'
import {css} from '@emotion/core'
import isPropValid from '@emotion/is-prop-valid'
import hashString from '@emotion/hash'
import {createElement, useTheme} from '@style-hooks/core'
import compose from '@essentials/compose'
import tags from 'html-tags'

const ws = /\s+/g
const serialize = (input, values, hooks) => {
  let replacer = (key, value) => {
    // if we get a function give us the code for that function
    if (Array.isArray(value)) {
      let out = ''
      value.forEach(v => (out += JSON.stringify(v, replacer)))
      return out
    }

    return !value
      ? ''
      : typeof value === 'function'
      ? `${value.name}=${value.toString().replace(ws, ' ')}`
      : typeof value.styles === 'string'
      ? value.styles.replace(ws, ' ')
      : typeof value.styledId === 'string'
      ? `.${value.styledId}`
      : typeof value === 'object'
      ? JSON.stringify(value)
      : value.toString().replace(ws, ' ')
  }
  // get a stringified version of our object
  // and indent the keys at 2 spaces
  let next

  if (values?.length) {
    next = []

    for (let i = 0; i < input.length; i++) {
      next.push(input[i])
      next.push(values[i])
    }

    next = JSON.stringify(next, replacer)
  } else {
    next = JSON.stringify(input, replacer)
  }

  next = hooks?.length ? next + JSON.stringify(hooks, replacer) : next
  return next
}

const tagged = (input, values, theme, props) => {
  let output = '',
    i = 0

  for (; i < input.length; i++) {
    const value = values[i]
    output +=
      input[i] +
      (!value
        ? ''
        : typeof value === 'function'
        ? css(value(theme, props)).styles
        : typeof value.styles === 'string'
        ? value.styles
        : typeof value.styledId === 'string'
        ? `.${value.styledId}`
        : value.toString())
  }

  return output
}

const withoutInvalidProps = props => {
  let output = {},
    keys = Object.keys(props),
    i = 0
  for (; i < keys.length; i++) {
    const key = keys[i]
    if (key === 'as' || key === 'css' || isPropValid(key)) {
      output[key] = props[key]
    }
  }
  return output
}

const mergeCssProp = (props, defaultStyles) => {
  props = Object.assign({}, props)
  if (Array.isArray(props.css)) {
    props.css = props.css.slice(0)
    props.css.push(defaultStyles)
  } else {
    props.css = defaultStyles
  }
  return props
}

const withStyleHooks = Component =>
  function() {
    const useHooks = compose.apply(this, arguments)
    const ComposedStyleComponent = React.forwardRef((props, ref) => {
      props = useHooks(props)
      props.ref = ref
      return React.createElement(Component, props)
    })

    if (__DEV__) {
      const args = [...arguments]
      ComposedStyleComponent.displayName =
        args.reduce((p, a) => `${p}${a.name || 'useAnonymous'}(`, '') +
        require('react-display-name').default(Component) +
        args.reduce(p => p + ')', '')
    }

    return ComposedStyleComponent
  }

const styled = Component => (input, ...args) => {
  const isDom = typeof Component === 'string'
  let useCss,
    useHooks = props => props,
    styledId,
    derivedCss

  if (Array.isArray(input)) {
    // styled.div`foo: bar;`
    styledId = `sh-${hashString(serialize(input, args))}`
    let hasFn = false
    for (let i = 0; i < args.length; i++) {
      if (typeof args[i] === 'function') {
        hasFn = true
        break
      }
    }

    if (hasFn) {
      useCss = props =>
        mergeCssProp(props, css(tagged(input, args, useTheme(), props)))
    } else {
      derivedCss = css(tagged(input, args))
      useCss = props => mergeCssProp(props, derivedCss)
    }
  } else {
    styledId = `sh-${hashString(serialize(input, null, args))}`

    if (Array.isArray(args[0]) && args[0].length > 0) {
      let hooks = compose.apply(this, args[0])
      useHooks = props => hooks(props)
    }

    if (typeof input === 'function') {
      // styled.div((theme, props) => {})
      useCss = props => mergeCssProp(props, css(input(useTheme(), props)))
    } else {
      // styled.div({foo: 'bar'})
      // styled.div(`foo: bar;')
      derivedCss = css(input)
      useCss = props => mergeCssProp(props, derivedCss)
    }
  }

  const StyledComponent = React.forwardRef((props, ref) => {
    props = useCss(useHooks(props))
    props.className = props.className
      ? `${props.className} ${styledId}`
      : styledId
    props =
      isDom || typeof props.as === 'string' ? withoutInvalidProps(props) : props
    props.ref = ref
    return createElement(Component, props)
  })

  StyledComponent.compose = withStyleHooks(StyledComponent)
  StyledComponent.styledId = styledId

  if (__DEV__) {
    StyledComponent.displayName = `styled(${require('react-display-name').default(
      Component
    )})`
  }

  return StyledComponent
}

for (let i = 0; i < tags.length; i++) styled[tags[i]] = styled(tags[i])
export default styled
