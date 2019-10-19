import React from 'react'
import {render} from '@testing-library/react'
import {ThemeProvider} from '@style-hooks/core'

export const renderWithTheme = (children, theme = {}, options = {}) =>
  render(children, {
    wrapper: ({children}) => (
      <ThemeProvider theme={theme} children={children} />
    ),
    ...options,
  })
