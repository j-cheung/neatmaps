import React from 'react'
import { Link } from 'react-router-dom'
import "./home.css"

//https://cuneyt.aliustaoglu.biz/en/using-google-maps-in-react-without-custom-libraries/
class GMap extends React.Component {
	constructor(props) {
		super(props)
		this.onScriptLoad = this.onScriptLoad.bind(this)
	}

	onScriptLoad() {
		const gmap = new window.google.maps.Map(
			document.getElementById(this.props.gmapId),
			this.props.options)
		this.props.onMapLoad(gmap)
	}

	componentDidMount(){
		if(!window.google) {
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
			markers: null
		}
	}

	_getFileData = (filename) => {
		console.log("get " + filename)
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
			console.log(data)
		})
	};

	//add overlay
	handleLoadFileClick = (filename) => {
		//get file => array of locations
		this.setState({
			filename: filename
		})
	}

	render() {
		if(this.state.filename){
			this._getFileData(this.state.filename)
		}
		return (
			<div className="homeWrapper">
				<GMap
					gmapId="gmap0"
					options={{
						center: {lat: 44.5802, lng: -103.4617},
						zoom: 4
					}}
					onMapLoad={map => {}}
					apiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}
				/>
				<HomeOptions handleLoadFileClick={this.handleLoadFileClick}/>
			</div>
		)
	}
}