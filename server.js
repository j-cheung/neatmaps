const express = require('express')
const fs = require('fs')
const csv2json = require('csv2json')
const mkdirp = require('mkdirp')
const app = express()

require('dotenv').config()
const port = process.env.PORT || 5000
const FILESTORE_PATH = "./filestore/"
const CSV_FILESTORE_PATH = FILESTORE_PATH + "csv/"
const JSON_FILESTORE_PATH = FILESTORE_PATH + "json/"

app.listen(port, () => console.log('Listening on port ' + port))

const bodyParser = require('body-parser')
app.use(bodyParser.json())
app.use(express.json())
app.post('/api/upload_csv', (req,res) => {
	filename = "file"
	csvFilePath = CSV_FILESTORE_PATH + filename + ".csv"
	csvHeader = req.body.columns
	csvData = req.body.data
	try {
		mkdirp(CSV_FILESTORE_PATH)
		let writeStream = fs.createWriteStream(csvFilePath)
		writeStream.once('open', () => {
			headerString = csvHeader.join(',') + '\n'
			writeStream.write(headerString)
			csvData.forEach((row) => {
				row = row.map((item) => {
					return ("\"" + item + "\"")
				})
				const rowString = row.join(',') + '\n'
				writeStream.write(rowString)
			})
			writeStream.end();
		})
	} catch(err) {
		return res.sendStatus(500).json(err)
	}
	saveJSONwithPos(filename)
	res.send({
		filename: filename
	})
})

const googleMapsClient = require('@google/maps').createClient({
	key: process.env.GOOGLE_MAPS_API_KEY,
	Promise: Promise
})

function _geocodeAddressPos(data) {
	const address = data.ADDRESS + "," + data.CITY + "," + data.STATE + " " + data.ZIPCODE
	return googleMapsClient.geocode({address: address}).asPromise()
		.then(
			(res) => {
				data['POSITION'] = res.json.results[0].geometry.location
				return data
			}
		)
};

function convCSV2JSON(csvFilePath, jsonFilePath){
	return new Promise((resolve, reject) => {
		fs.createReadStream(csvFilePath)
		.pipe(csv2json())
		.pipe(fs.createWriteStream(jsonFilePath))
		.on('finish', () => {return resolve(null)})
		.on('error', (err) => {return reject(err)})
	})
}

function saveJSONwithPos(filename) {
	const csvFilePath = CSV_FILESTORE_PATH + filename + ".csv"
	const jsonFilePath = JSON_FILESTORE_PATH + filename + ".json"
	try{
		mkdirp(JSON_FILESTORE_PATH)
		convCSV2JSON(csvFilePath,jsonFilePath)
			.then(
				() => {
					var obj = JSON.parse(fs.readFileSync(jsonFilePath,'utf8'))
					return(obj)
				}
			)
			.then(
				(obj) => {
					const geocodePromises = obj.map(_geocodeAddressPos)
					Promise.all(geocodePromises)
						.then((withPos) => {
							var withPosStr = JSON.stringify(withPos)
							fs.writeFile(
								jsonFilePath,
								withPosStr,
								'utf8',
								(err) => {
									if(err){throw err} 
									console.log("saved JSON with Positions")
								}
							)
						})
				}
			)
			.catch(err => {
				console.log(err)
			})
	}
	catch(e){
		console.error(e)
	}
}

app.get('/api/get_file_list', (req,res) => {
	//return array of filenames in filestore/
	fs.readdir(FILESTORE_PATH, (err, files) => {
		if(err){
			throw(err)
			res.sendStatus(500).json(err)
		}
		res.send({
			fileList: files
		})
	})
})

app.post('/api/get_file', (req,res) => {
	filename = req.body.filename
	filePath = FILESTORE_PATH + filename
	fs.createReadStream(filePath)
		.pipe(csv2json())
		.pipe(res)
})

