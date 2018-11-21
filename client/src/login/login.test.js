import React from 'react'
import { shallow, mount } from 'enzyme'

import Login, {LoginForm} from './login'

describe('Login', () => {
	it('renders LoginTitle and LoginForm', () => {
		const component = shallow(<Login/>)
		expect(component).toMatchSnapshot()
	});

	describe('children: ', () => {
		const component = mount(<Login/>)

		it('renders LoginTitle that says Neat Maps', () => {
			expect(component.find('h1').text()).toEqual('Neat Maps')
		});

		it('renders LoginForm with two input fields', () => {
			expect(component.find('.loginField').length).toBe(2)
		});

		it('renders LoginForm with one submit button', () => {
			expect(component.find('.loginSubmit').length).toBe(1)
		});
	})

	describe('authenticate', () => {

		window.alert = jest.fn()
		it('alerts on empty credentials', () => {
			const component = shallow(<Login/>)
			component.setState({email: '', password: ''})
			const event = { preventDefault: () => {} };
			component.instance().handleSubmit(event)
			expect(window.alert).toHaveBeenCalledWith("Please enter credentials")
		})

		it('calls neat authentication api', () => {
			fetch.resetMocks()
			fetch.mockResponse(JSON.stringify("OK"))
			const historyMock = {push: jest.fn()}
			const component = shallow(<Login history={historyMock}/>)
			component.setState({email: "email@email.com", password: "password123"})
			const event = { preventDefault: () => {} };
			component.instance().handleSubmit(event)
			expect(fetch.mock.calls.length).toEqual(1)
			expect(fetch.mock.calls[0][0].toString()).toEqual('http://neat-mvp-api.herokuapp.com/v1/auth?email=email%40email.com&password=password123')
		})

		it('getSignJWT calls api', () => {
			fetch.resetMocks()
			fetch.mockResponseOnce(JSON.stringify("asdfdsfafadsfa"))
			const component = shallow(<Login/>)
			component.instance().getSignJWT()
			expect(fetch.mock.calls.length).toEqual(1)
			expect(fetch.mock.calls[0][0].toString()).toEqual('/api/sign_jwt')
		})
	})
	

})
