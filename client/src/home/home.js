import React from 'react'
import { Link } from 'react-router-dom'
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
		fetch('/api/get_file_list')
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
	render() {
		return (
			<div className="homeOptionsBar">
				<Link to="/upload" className="homeOptionsButton">
					Upload
				</Link>
				<LoadPrevFiles handleLoadFileClick={this.props.handleLoadFileClick}/>
				<div className="homeOptionsButton">Logout</div>
			</div>
		)
	}
}

export default class Home extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			filename: null,
			groupedData: null
		}
	}

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
	}

	_getFileData = (filename) => {
		fetch('/api/get_file', {
			method: 'POST',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				filename: filename
			})
		})
		.then(response => response.json())
		.then(data => {
			const grouped = this._groupDataByCategory(data)
			this.setState({
				groupedData: grouped
			})
		})
	};

	//add overlay
	handleLoadFileClick = (filename) => {
		//get file => array of locations
		this.setState({
			filename: filename
		})
		this._getFileData(filename)
	};

	showMarkers = (gmap) => {
		const icons = [
			'red','green','blue','yellow','orange','purple','lightblue',
			'red-dot','green-dot','blue-dot','yellow-dot','orange-dot','purple-dot','lightblue'
		];
		console.log(this.state.groupedData)
		const groupedData = this.state.groupedData
		Object.keys(groupedData).forEach((key, groupIndex) => {
			console.log(groupedData[key])
			groupedData[key].map(
				(member) => {
					console.log(member)
					console.log(groupIndex)
					const marker = new window.google.maps.Marker({
						position: member.POSITION,
						map: gmap,
						icon: 'http://maps.google.com/mapfiles/ms/icons/' + icons[groupIndex] + '.png'
					})
				}
			)
		})
	};

	onMapLoad = (gmap) => {
		if(this.state.groupedData){
			this.showMarkers(gmap)
		}
	};

	render() {
		console.log("rerender")
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