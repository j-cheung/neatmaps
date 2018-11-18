import React from 'react'
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

export default class Home extends React.Component {
	render() {
		return (
			<div className="homeWrapper">
				<GMap
					gmapId="gmap0"
					options={{
						// center: {lat: 39.8283, lng: -98.5795},
						center: {lat: 44.5802, lng: -103.4617},
						zoom: 4
					}}
					onMapLoad={map => {}}
					apiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}
				/>
			</div>
		)
	}
}