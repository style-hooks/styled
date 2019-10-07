[![bundlephobia](https://img.shields.io/bundlephobia/minzip/@style-hooks/styled?style=plastic)](https://bundlephobia.com/result?p=@style-hooks/styled)
[![codecov](https://codecov.io/gh/style-hooks/styled/branch/master/graph/badge.svg)](https://codecov.io/gh/style-hooks/styled)
[![Build Status](https://travis-ci.org/style-hooks/styled.svg?branch=master)](https://travis-ci.org/style-hooks/styled)
[![MIT license](https://img.shields.io/badge/License-MIT-blue.svg)](https://jaredlunde.mit-license.org/)

---

<p align=center>
  <br/>
  <img src='https://raw.githubusercontent.com/style-hooks/docs/master/assets/logo%402x.png' width='320'/>
</p>

<h2 align=center>Supercharge your styled components with style hooks and themes</h2>

```jsx harmony
import React from 'react'
import {css} from '@emotion/core'
import {createStyleHook} from '@style-hooks/core'
import styled from '@style-hooks/styled'

// Can be used like any other styled component system
let DivA = styled.div`
  margin: 0;
`

// The magic happens when you add @style-hooks/core
// to the mix
let useBox = createStyleHook('box', {
  m: (value, theme, props) =>
    css`
      margin: ${value}rem;
    `,
})
let useText = createStyleHook('text', {
  size: (value, theme, props) =>
    css`
      font-size: ${value}rem;
    `,
})

// Styled components composed with style hooks
// <DivAWithBoxAndText size='1' m='2'/>
let DivAWithBoxAndText = DivA.compose(
  useText,
  useBox
)

// Styled components with functions in template literals
// <DivB color='red'/>
let DivB = styled.div`
  color: ${(theme, props) => theme.colors[props.color]};
`

// Another way to compose style hooks with styled components
let DivC = styled.div(`margin: 0;`, [useBox])

// Flexible inputs, you can use strings, objects,
// and functions with props/themes
let DivD = styled.div(`margin: 0;`)
let DivE = styled.div({margin: 0})
let DivF = styled.div((theme, props) => `margin: 0;`, [useBox])
let DivG = styled.div((theme, props) => ({margin: 0}))

// And you can always create additional components
// with extra style hooks
let DivH = DivG.compose(useBox)
```

## Installation

#### `npm i @style-hooks/styled @style-hooks/core @emotion/core`

#### `yarn add @style-hooks/styled @style-hooks/core @emotion/core`

## Peer dependencies

- `@emotion/core`
- `@style-hooks/core`

## Playground

Check out
[`@style-hooks/styled` on CodeSandbox](https://codesandbox.io/s/style-hooksstyled-basic-example-y9x6s)

## [API Documentation](https://style-hooks.jaredlunde.com/styled-components/)

Complete documentation can be found
[here](https://style-hooks.jaredlunde.com/styled-components/)

## LICENSE

MIT
