import React from 'react'
import { Link } from 'react-router-dom'
import Cookies from 'universal-cookie'
import "./home.css"

//https://cuneyt.aliustaoglu.biz/en/using-google-maps-in-react-without-custom-libraries/
class GMap extends React.Component {
	constructor(props) {
		super(props)
		this.onScriptLoad = this.onScriptLoad.bind(this)
		this.state = {
			gmap: null
		}
	}

	onScriptLoad() {
		const gmap = new window.google.maps.Map(
			document.getElementById(this.props.gmapId),
			this.props.options
		)
		this.setState({
			gmap: gmap
		})
	}

	componentDidMount(){
		if(!window.google) { 
		//if Google Maps API Script not loaded, add to page
			var s = document.createElement('script')
			s.type = 'text/javascript'
			s.src = "https://maps.google.com/maps/api/js?key=" + this.props.apiKey;
			var x = document.getElementsByTagName('script')[0];
			x.parentNode.insertBefore(s,x);
			s.addEventListener('load', e => {
				this.onScriptLoad()
			})
		} else {
			this.onScriptLoad()
		}
	}

	componentDidUpdate(){
		this.props.onMapLoad(this.state.gmap)
	}

	render() {
		return (
			<div className="homeMap" id={this.props.gmapId}/>
		)
	}
}
//load previously uploaded files if available
class LoadPrevFiles extends React.Component {
	constructor(props){
		super(props)
		this.state = {
			fileList : []
		}
	}

	componentDidMount() {
		const cookies = new Cookies
		console.log(cookies.get('neatmaps-token'))
		fetch('/api/get_file_list',{
			headers:{
				'Authorization': `Bearer ${cookies.get('neatmaps-token')}`
			}
		})
		.then(response => response.json())
		.then(data => {
				this.setState({
					fileList : data.fileList
				})
			}
		)
	}

	render() {
		if(this.state.fileList && this.state.fileList.length>0){
			const fileList = this.state.fileList
			return (
				fileList.map(
					(filename) => (
						<button 
							className="homeOptionsButton" 
							key={filename}
							onClick={(e) => 
								this.props.handleLoadFileClick(filename)
							}
						>
							{filename}
						</button>
					)
				)
			)
		}
		return null
	}
}

class HomeOptions extends React.Component {

	handleLogout = () => {
		const cookies = new Cookies()
		cookies.remove('neatmaps-token')
	}

	render() {
		return (
			<div className="homeOptionsBar">
				<Link to="/upload" className="homeOptionsButton">
					Upload
				</Link>
				<LoadPrevFiles handleLoadFileClick={this.props.handleLoadFileClick}/>
				<Link to="/login" onClick={this.handleLogout} className="homeOptionsButton">
					Logout
				</Link>
			</div>
		)
	}
}

export default class Home extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			filename: null,
			groupedData: null,
			markers: []
		}
	};

	_groupDataByCategory = (data) => {
		var categories = {}
		data.map((row) => {
			if(!categories[row.CATEGORY]){
				categories[row.CATEGORY] = []
			}
			var rowCategory = row.CATEGORY
			delete row.CATEGORY
			categories[rowCategory].push(row)
		})
		return categories
	};

	_getFileData = (filename) => {
		const cookies = new Cookies()
		fetch('/api/get_file', {
			method: 'POST',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${cookies.get('neatmaps-token')}`
			},
			body: JSON.stringify({
				filename: filename
			})
		})
		.then(response => response.json())
		.then(data => {
			return this._groupDataByCategory(data)
		})
		.then(grouped => {
			const markers = this.addMarkers(grouped)
			this.setState({
				groupedData: grouped,
				markers: markers
			})
		})
	};

	//add overlay
	handleLoadFileClick = (filename) => {
		//clear markers 
		this.state.markers.map((marker) => {marker.setMap(null)})
		//get file => array of locations
		this.setState({
			filename: filename,
			markers: []
		})
		this._getFileData(filename)
	};

	addMarkers = (groupedData) => {
		const markers = []
		const icons = [
			'red','green','blue','yellow','orange','purple','lightblue',
			'red-dot','green-dot','blue-dot','yellow-dot','orange-dot','purple-dot','lightblue'
		];
		Object.keys(groupedData).forEach((key, groupIndex) => {
			console.log(groupedData[key])
			groupedData[key].map(
				(member) => {
					const marker = new window.google.maps.Marker({
						position: member.POSITION,
						map: null,
						icon: 'http://maps.google.com/mapfiles/ms/icons/' + icons[groupIndex] + '.png'
					})
					markers.push(marker)
				}
			)
		})
		return markers
	};

	showMarkers = (gmap) => {
		this.state.markers.map((marker) => marker.setMap(gmap))
	};

	onMapLoad = (gmap) => {
		if(this.state.groupedData && this.state.markers.length > 0){
			this.showMarkers(gmap)
		}
	};

	render() {
		return (
			<div className="homeWrapper">
				<GMap
					gmapId="gmap0"
					options={{
						center: {lat: 44.5802, lng: -103.4617},
						zoom: 4
					}}
					onMapLoad={this.onMapLoad}
					apiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}
				/>
				<HomeOptions handleLoadFileClick={this.handleLoadFileClick}/>
			</div>
		)
	}
}