import React from 'react'
import { shallow, mount } from 'enzyme'
import Upload from './upload'

describe('Upload', () => {
	describe('Renders', () => {
		const component = shallow(<Upload/>)

		it('without uploaded file', () => {
			expect(component).toMatchSnapshot()
		})

		it('table with uploaded file', () => {
			component.setState({
				csvArray: ["data1","data2","data3"]
			})
			expect(component).toMatchSnapshot()
		})
	})

	describe('Handles Cancel', () => {
		const historyMock = {push: jest.fn()}
		const component = mount(<Upload history={historyMock}/>)

		it('calls push history', () => {
			component.instance().handleCancel()
			expect(historyMock.push.mock.calls[0]).toEqual([{'pathname':'/home'}])
		})
	})

	describe('Handles Submit', () => {
		fetch.mockResponseOnce()
		const component = mount(<Upload/>)
		it('tries to fetch if headers are correct', () => {
			component.setState({columnHeaders: ['CATEGORY','CITY','STATE','ZIPCODE','ADDRESS']})
			component.instance().handleSubmitChanges()
			expect(fetch.mock.calls.length).toEqual(1)
			expect(fetch.mock.calls[0][0]).toEqual("/api/upload_csv")
		})

		describe('Alert errors: ', () => {
			const component = mount(<Upload/>)

			window.alert = jest.fn()
			it('submit empty columnHeaders', () => {
				component.setState({columnHeaders: ['','','','','']})
				component.instance().handleSubmitChanges()
				expect(window.alert).toHaveBeenCalledWith("Please select column headers")

				component.setState({columnHeaders: ['','','STATE','','']})
				component.instance().handleSubmitChanges()
				expect(window.alert).toHaveBeenCalledWith("Please select column headers")
			})

			it('submit duplicate columnHeaders', () => {
				component.setState({columnHeaders: ['CATEGORY','CATEGORY','STATE','ZIPCODE','ADDRESS']})
				component.instance().handleSubmitChanges()
				expect(window.alert).toHaveBeenCalledWith("Please do not duplicate column headers")
			})
		})
	})
})