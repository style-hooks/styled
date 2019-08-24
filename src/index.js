import React from 'react'
import {css} from '@emotion/core'
import isPropValid from '@emotion/is-prop-valid'
import {createElement, useTheme} from '@style-hooks/core'
import compose from '@essentials/compose'
import tags from 'html-tags'

const tagged = (input, values, props, theme) => {
  let output = '',
    i = 0

  for (; i < input.length; i++) {
    const value = values[i]
    output +=
      input[i] +
      (!value
        ? ''
        : typeof value === 'function'
        ? css(value(props, theme)).styles
        : typeof value.styles === 'string'
        ? value.styles
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
    if (key === 'as' || key === 'css' || isPropValid(key))
      output[key] = props[key]
  }
  return output
}

const mergeCssProp = (props, defaultStyles) => {
  props = Object.assign({}, props)
  if (Array.isArray(props.css)) {
    props.css = props.css.slice(0)
    props.css.push(defaultStyles)
  } else props.css = defaultStyles
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
    useHooks = props => props

  if (Array.isArray(input)) {
    // styled.div`foo: bar;`
    let hasFn = false
    for (let i = 0; i < args.length; i++) {
      if (typeof args[i] === 'function') {
        hasFn = true
        break
      }
    }

    useCss = hasFn
      ? props =>
          mergeCssProp(props, css(tagged(input, args, props, useTheme())))
      : props => mergeCssProp(props, css(tagged(input, args, props, null)))
  } else {
    if (Array.isArray(args[0]) && args[0].length > 0) {
      let hooks = compose.apply(this, args[0])
      useHooks = props => hooks(props)
    }

    useCss =
      typeof input === 'function'
        ? // styled.div((props, theme) => {})
          props => mergeCssProp(props, css(input(props, useTheme())))
        : // styled.div({foo: 'bar'})
          // styled.div(`foo: bar;')
          props => mergeCssProp(props, css(input))
  }

  const StyledComponent = React.forwardRef((props, ref) => {
    props = useCss(useHooks(props))
    props =
      isDom || typeof props.as === 'string' ? withoutInvalidProps(props) : props
    props.ref = ref
    return createElement(Component, props)
  })

  StyledComponent.compose = withStyleHooks(StyledComponent)

  if (__DEV__)
    StyledComponent.displayName = `styled(${require('react-display-name').default(
      Component
    )})`

  return StyledComponent
}

for (let i = 0; i < tags.length; i++) styled[tags[i]] = styled(tags[i])
export default styled
