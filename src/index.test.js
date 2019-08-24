import React from 'react'
import {createStyleHook} from '@style-hooks/core'
import {css} from '@emotion/core'
import {renderWithTheme} from 'test-utils'
import styled from './index'

const theme = {colors: {black: '#000'}}
const useBox = createStyleHook('box', {
    w: v =>
      css`
        width: ${v}px;
      `,
  }),
  useText = createStyleHook('text', {
    size: v =>
      css`
        font-size: ${v}rem;
      `,
  })

test('template literal [plain string]', () => {
  const Component = styled.div`
    color: blue;
  `
  expect(renderWithTheme(<Component />).asFragment()).toMatchSnapshot()
})

test('template literal [function -> string]', () => {
  const Component = styled.div`
    color: blue;
    ${(props, theme) =>
      props.solid ? `background: ${theme.colors.black};` : ''}
  `
  expect(
    renderWithTheme(<Component solid />, theme).asFragment()
  ).toMatchSnapshot()
  expect(renderWithTheme(<Component />, theme).asFragment()).toMatchSnapshot()
})

test('template literal [css]', () => {
  const Component = styled.div`
    color: blue;
    ${css`
      background: ${theme.colors.black};
    `}
  `
  expect(
    renderWithTheme(<Component solid />, theme).asFragment()
  ).toMatchSnapshot()
})

test('template literal [falsy]', () => {
  const Component = styled.div`
    color: blue;
    ${false}
    ${void 0}
    ${null}
    ${0}
  `
  expect(
    renderWithTheme(<Component solid />, theme).asFragment()
  ).toMatchSnapshot()
})

test('template literal [function -> object]', () => {
  const Component = styled.div`
    color: blue;
    ${(props, theme) => props.solid && {background: theme.colors.black}}
  `
  expect(
    renderWithTheme(<Component solid />, theme).asFragment()
  ).toMatchSnapshot()
})

test('template literal [as prop]', () => {
  // eslint-disable-next-line no-unused-vars
  const Component = styled.div`
    color: blue;
    background-color: #000;
  `
  expect(
    renderWithTheme(<Component as="span" />).asFragment()
  ).toMatchSnapshot()
})

test('template literal [custom component]', () => {
  // eslint-disable-next-line no-unused-vars
  const MyComponent = ({solid, ...props}) => <span {...props} />
  const Component = styled(MyComponent)`
    color: blue;
    ${(props, theme) => props.solid && {background: theme.colors.black}}
  `
  expect(
    renderWithTheme(<Component solid />, theme).asFragment()
  ).toMatchSnapshot()
})

test('template literal [with hooks]', () => {
  // eslint-disable-next-line no-unused-vars
  const Component = styled.div`
    color: blue;
  `.compose(
    useText,
    useBox
  )

  expect(
    renderWithTheme(<Component size="1" w="200" />).asFragment()
  ).toMatchSnapshot()
})

test('function', () => {
  // eslint-disable-next-line no-unused-vars
  const Component = styled.div(
    (props, theme) => `
    color: blue;
    ${props.solid ? `background-color: ${theme.colors.black};` : ''}
  `
  )
  expect(
    renderWithTheme(<Component solid />, theme).asFragment()
  ).toMatchSnapshot()
})

test('function [returns object]', () => {
  // eslint-disable-next-line no-unused-vars
  const Component = styled.div((props, theme) => ({
    color: 'blue',
    backgroundColor: props.solid ? theme.colors.black : 'transparent',
  }))
  expect(
    renderWithTheme(<Component solid />, theme).asFragment()
  ).toMatchSnapshot()
})

test('function [with hooks]', () => {
  // eslint-disable-next-line no-unused-vars
  const Component = styled.div((props, theme) => `color: blue;`, [
    useText,
    useBox,
  ])
  expect(
    renderWithTheme(<Component size="1" w="200" />).asFragment()
  ).toMatchSnapshot()
})

test('function [custom component]', () => {
  // eslint-disable-next-line no-unused-vars
  const MyComponent = ({solid, ...props}) => <span {...props} />
  const Component = styled(MyComponent)((props, theme) => ({
    color: 'blue',
    backgroundColor: props.solid ? theme.colors.black : 'transparent',
  }))
  expect(
    renderWithTheme(<Component solid />, theme).asFragment()
  ).toMatchSnapshot()
})

test('string', () => {
  // eslint-disable-next-line no-unused-vars
  const Component = styled.div('color: blue; background-color: #000;')
  expect(renderWithTheme(<Component />).asFragment()).toMatchSnapshot()
})

test('string [as prop]', () => {
  // eslint-disable-next-line no-unused-vars
  const Component = styled.div('color: blue; background-color: #000;')
  expect(
    renderWithTheme(<Component as="span" />).asFragment()
  ).toMatchSnapshot()
})

test('string [custom component]', () => {
  // eslint-disable-next-line no-unused-vars
  const MyComponent = ({solid, ...props}) => <span {...props} />
  const Component = styled(MyComponent)('color: blue; background-color: #000;')
  expect(
    renderWithTheme(<Component solid />, theme).asFragment()
  ).toMatchSnapshot()
})

test('string [with hooks]', () => {
  // eslint-disable-next-line no-unused-vars
  const Component = styled.div(`color: blue;`, [useText, useBox])
  expect(
    renderWithTheme(<Component size="1" w="200" />).asFragment()
  ).toMatchSnapshot()
})

test('object', () => {
  // eslint-disable-next-line no-unused-vars
  const Component = styled.div({color: 'blue', backgroundColor: '#000'})
  expect(renderWithTheme(<Component />).asFragment()).toMatchSnapshot()
})

test('object [custom component]', () => {
  // eslint-disable-next-line no-unused-vars
  const MyComponent = ({solid, ...props}) => <span {...props} />
  const Component = styled(MyComponent)({
    color: 'blue',
    backgroundColor: '#000',
  })
  expect(
    renderWithTheme(<Component solid />, theme).asFragment()
  ).toMatchSnapshot()
})

test('object [as prop]', () => {
  // eslint-disable-next-line no-unused-vars
  const Component = styled.div({color: 'blue', backgroundColor: '#000'})
  expect(
    renderWithTheme(<Component as="span" />).asFragment()
  ).toMatchSnapshot()
})

test('object [with hooks]', () => {
  // eslint-disable-next-line no-unused-vars
  const Component = styled.div({color: 'blue', backgroundColor: '#000'}, [
    useText,
    useBox,
  ])
  expect(
    renderWithTheme(<Component size="1" w="200" />).asFragment()
  ).toMatchSnapshot()
})
