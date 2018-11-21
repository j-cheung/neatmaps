import React from 'react'
import { shallow, mount } from 'enzyme'
import Home, {HomeOptions, LoadPrevFiles} from './home'

describe('Home', () => {
	it('renders', () => {
		const component = shallow(<Home/>)
		expect(component).toMatchSnapshot()
	});

	describe('options', () => {
		const component = shallow(<HomeOptions/>)
		it('has 2 options buttons', () => {
			expect(component.find('.homeOptionsButton').length).toBe(2)
		})
	})

	describe('prev-files', () => {
		const component = shallow(<LoadPrevFiles/>)

		it('renders nothing when no files saved', () => {
			// component.setState({fileList: []})
			expect(component.type()).toEqual(null)
		})

		it('renders buttons if state set with file list', () => {
			component.setState({fileList: ['file1', 'file2']})
			// component.update()
			expect(component.find('.homeOptionsButton').length).toEqual(2)
			expect(component.find('.homeOptionsButton').at(0).text()).toEqual('file1')
			expect(component.find('.homeOptionsButton').at(1).text()).toEqual('file2')
		})

		fetch.resetMocks()
		it('calls gets file list', () => {
			fetch.mockResponse(JSON.stringify({fileList:["data","data1"]}))
			const component = shallow(<LoadPrevFiles/>)
			expect(fetch.mock.calls.length).toEqual(1)
			expect(fetch.mock.calls[0][0]).toEqual('/api/get_file_list')
		})

	})

	describe('functions', () => {
		const component = shallow(<Home/>)

		it('calls show markers when markers array is populated and there is grouped data', () => {
			component.setState({groupedData:{a: "aaa"} , markers: ["a","a","a"]})
			component.instance().showMarkers = jest.fn()
			component.update()
			component.instance().onMapLoad()
			expect(component.instance().showMarkers).toHaveBeenCalled()
		})

		it('does not call show markers when markers array is not populated', () => {
			component.setState({markers: []})
			component.instance().showMarkers = jest.fn()
			component.update()
			component.instance().onMapLoad()
			expect(component.instance().showMarkers).not.toHaveBeenCalled()
		})
	})
})