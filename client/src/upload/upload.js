import React from 'react'
import CSVReader from 'react-csv-reader'
import Cookies from 'universal-cookie'
import "./upload.css"

class SelectColumnHeader extends React.Component {
	render() {
		const indices = [0,1,2,3,4]
		return (
			<thead>
				<tr>
					{indices.map(
						(index)=>(
							<td key={"column" + index}>
								<select 
									name="columnName" 
									onChange={(e) => this.props.onChangeColumn(e,index)} 
									value={this.props.columnHeaders[index]}
								>
									<option hidden disabled value=""></option>
									<option value="ADDRESS">ADDRESS</option>
									<option value="CITY">CITY</option>
									<option value="STATE">STATE</option>
									<option value="ZIPCODE">ZIPCODE</option>
									<option value="CATEGORY">CATEGORY</option>
								</select>
							</td>
						)
					)}
				</tr>
			</thead>
		)
	}
}

class CSVTableViewAndSubmit extends React.Component {

	render() {
		const tableData = this.props.tableData
		return (
			<div className="uploadViewAndSubmit">
				<table className="uploadTable">
					<SelectColumnHeader 
							columnHeaders={this.props.columnHeaders} 
							onChangeColumn={this.props.onChangeColumn}
					/>
					<tbody>
						{tableData.map(
							(tableRow, index0) => {
								return(
									<tr key={index0}>
										{tableRow.map(
												(tableCell, index1) => {
													return (<td key={index0 + "." + index1}>{tableCell}</td>)
												}
										)}
									</tr>
								)
							}
						)}
					</tbody>
				</table>
				<button className="uploadSubmitBtn" onClick={this.props.handleSubmitChanges}>OK</button>
			</div>
		)
	}
}

export default class Upload extends React.Component {
	constructor(props){
		super(props)
		this.state={
			csvArray: [],
			filename: "",
			columnHeaders: Array(5).fill(''),
			headersSelected: false,
		}
	}

	onFileLoaded = (file, filename) => {
		console.log(filename)
		//validate file
		//if 5 columns
		this.setState({
			csvArray: file,
			filename: filename
		})
	};

	onChangeColumn = (event, index) => {
		const selectedValue = event.target.value
		const newHeaders = this.state.columnHeaders.slice()
		newHeaders[index] = selectedValue
		this.setState({
			columnHeaders: newHeaders
		})
	};

	handleSubmitChanges = () => {
		//validate selections
		const columnHeaders = this.state.columnHeaders
		if(columnHeaders.includes('')){
			alert("Please select column headers")
			return
		}
		if([...new Set(columnHeaders)].length !== 5){
			alert("Please do not duplicate column headers")
			return 
		}
		this.setState({
			headersSelected: true
		})
		const origArray = this.state.csvArray
		const cookies = new Cookies()
		fetch('/api/upload_csv', {
			method: 'POST',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${cookies.get('token')}`
			},
			body: JSON.stringify({
				filename: this.state.filename,
				columns: columnHeaders,
				data: origArray
			})
		})
		.then(response => {
			if(response.status === 200){
				this.props.history.push({
					pathname: '/home'
				})
			}
		})
	};

	handleCancel = () => {
		this.props.history.push({
			pathname: '/home'
		})
	};

	render() {
		return (
			<div className="uploadWrapper">
				<div className="uploadHeader">
					<div className="uploadTitle"> UPLOAD FILE </div>
					<button className="uploadCancelBtn" onClick={this.handleCancel}>Cancel</button>
				</div>
				<CSVReader
					cssClass="uploadCsvInput"
					onFileLoaded={this.onFileLoaded}
				/>
				{(this.state.csvArray && this.state.csvArray.length > 0) ? 
					(
						<CSVTableViewAndSubmit
						tableData={this.state.csvArray} 
						columnHeaders={this.state.columnHeaders} 
						onChangeColumn={this.onChangeColumn}
						handleSubmitChanges={this.handleSubmitChanges}
						/>
					)
					: <React.Fragment></React.Fragment>
				}
			</div>
		)
	}
}
