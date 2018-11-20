import React from 'react'
import CSVReader from 'react-csv-reader'
import "./upload.css"

class Reader extends React.Component {
	render() {
		return (
			<CSVReader
				cssClass="fileReader"
				label="Upload CSV"
				onFileLoaded={this.props.onFileLoaded}
			/>
		)
	}
}

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
			columnHeaders: Array(5).fill(''),
			headersSelected: false
		}
	}

	onFileLoaded = (file) => {
		console.log(file)
		//validate file
		//if 5 columns
		this.setState({
			csvArray: file
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
		this.setState({
			headersSelected: true
		})
		const origArray = this.state.csvArray
		fetch('/api/upload_csv', {
			method: 'POST',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
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
		// let showCSV = 
		// )
		// if(this.state.csvArray && this.state.csvArray.length > 0){

		// 	return (
		// 		<div className="uploadWrapper">
		// 			<h1> UPLOAD FILE </h1>
		// 			<button onClick={this.handleCancel}>Cancel</button>
		// 			<Reader onFileLoaded={this.onFileLoaded}/>
		// 			<CSVTableView 
		// 				tableData={this.state.csvArray} 
		// 				columnHeaders={this.state.columnHeaders} 
		// 				onChangeColumn={this.onChangeColumn}
		// 			/>
		// 			<button onClick={this.handleSubmitChanges}>OK</button>
		// 		</div>
		// 	)
		// }

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
