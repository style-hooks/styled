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
    ${(theme, props) =>
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
    ${(theme, props) => props.solid && {background: theme.colors.black}}
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
    ${(theme, props) => props.solid && {background: theme.colors.black}}
  `
  expect(
    renderWithTheme(<Component solid />, theme).asFragment()
  ).toMatchSnapshot()
})

test('template literal [nesting]', () => {
  // eslint-disable-next-line no-unused-vars
  const MyComponent = ({solid, ...props}) => <span {...props} />
  const ComponentA = styled(MyComponent)`
    color: blue;
    ${(theme, props) => props.solid && {background: theme.colors.black}}
  `
  const ComponentB = styled.div`
    ${ComponentA} > & {
      display: none;
    }
  `
  expect(
    renderWithTheme(<ComponentB solid />, theme).asFragment()
  ).toMatchSnapshot()
})

test('template literal [styledId]', () => {
  // eslint-disable-next-line no-unused-vars
  const MyComponent = ({solid, ...props}) => <span {...props} />
  const fn = (theme, props) => props.solid && {background: theme.colors.black}
  const ComponentA = styled(MyComponent)`
    color: blue;
    ${fn}
  `
  const ComponentB = styled.div`
    color: blue;
    ${fn}
  `
  expect(ComponentA.styledId).toBe(ComponentB.styledId)
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
    (theme, props) => `
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
  const Component = styled.div((theme, props) => ({
    color: 'blue',
    backgroundColor: props.solid ? theme.colors.black : 'transparent',
  }))
  expect(
    renderWithTheme(<Component solid />, theme).asFragment()
  ).toMatchSnapshot()
})

test('function [with hooks]', () => {
  // eslint-disable-next-line no-unused-vars
  const Component = styled.div((theme, props) => `color: blue;`, [
    useText,
    useBox,
  ])
  expect(
    renderWithTheme(<Component size="1" w="200" />).asFragment()
  ).toMatchSnapshot()
})

test('function [styledId]', () => {
  // eslint-disable-next-line no-unused-vars
  const fn = (theme, props) => `color: blue;`
  const ComponentA = styled.div(fn, [useText, useBox])
  // eslint-disable-next-line no-unused-vars
  const ComponentB = styled.div(fn, [useText, useBox])
  expect(ComponentA.styledId).toBe(ComponentB.styledId)
})

test('function [custom component]', () => {
  // eslint-disable-next-line no-unused-vars
  const MyComponent = ({solid, ...props}) => <span {...props} />
  const Component = styled(MyComponent)((theme, props) => ({
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

test('object [styledId]', () => {
  const ComponentA = styled.div({color: 'blue', backgroundColor: '#000'})
  const ComponentB = styled.div({color: 'blue', backgroundColor: '#000'})
  expect(ComponentA.styledId).toBe(ComponentB.styledId)
})

test('object [styledId w/ hooks]', () => {
  const ComponentA = styled.div({color: 'blue', backgroundColor: '#000'}, [
    useBox,
    useText,
  ])
  const ComponentB = styled.div({color: 'blue', backgroundColor: '#000'}, [
    useBox,
    useText,
  ])
  expect(ComponentA.styledId).toBe(ComponentB.styledId)
})

test('object [styledId w/ mixed hooks]', () => {
  const ComponentA = styled.div({color: 'blue', backgroundColor: '#000'})
  const ComponentB = styled.div({color: 'blue', backgroundColor: '#000'}, [
    useBox,
    useText,
  ])
  expect(ComponentA.styledId).not.toBe(ComponentB.styledId)
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
