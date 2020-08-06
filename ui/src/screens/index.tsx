import React from 'react'
import { Router } from '@reach/router'
import Home from './Home'
import Pokemon from './pokemon'

const Screens: React.FC<{ clickLink: Function }> = ({ clickLink }) => (
  <Router style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
    <Pokemon clickLink={clickLink} path="/" />
    <ID clickLink={clickLink} path=":id" />
  </Router>
)

export default Screens