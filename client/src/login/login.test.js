import React from 'react'
import { shallow } from 'enzyme'

import Login from './login'

describe('Login', () => {
	it('should render', () => {
		const component = shallow(<Login/>)
		expect(component).toMatchSnapshot()
	})
})