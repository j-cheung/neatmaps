import React from 'react'
import CSVReader from 'react-csv-reader'
import "./upload.css"

class Reader extends React.Component {
	render() {
		return (
			<CSVReader
				cssClass="fileReader"
				label="Upload CSV"
			/>
		)
	}
}

export default class Upload extends React.Component {
	render() {
		return (
			<div className="uploadWrapper">
				<h1> UPLOAD FILE </h1>
				<Reader />
			</div>
		)
	}
}
