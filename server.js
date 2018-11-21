const express = require('express')
const fs = require('fs')
const csv2json = require('csv2json')
const mkdirp = require('mkdirp')
const app = express()
const jwt = require('jsonwebtoken')
const expressJWT = require('express-jwt')

require('dotenv').config()
const port = process.env.PORT || 5000
const FILESTORE_PATH = "./filestore/"
const CSV_FILESTORE_PATH = FILESTORE_PATH + "csv/"
const JSON_FILESTORE_PATH = FILESTORE_PATH + "json/"
const JWT_KEY = "thisshouldbeasecret"
mkdirp(FILESTORE_PATH)
mkdirp(CSV_FILESTORE_PATH)
mkdirp(JSON_FILESTORE_PATH)

app.listen(port, () => console.log('Listening on port ' + port))

const bodyParser = require('body-parser')
app.use(bodyParser.json())
app.use(express.json())
app.post('/api/upload_csv', 
	expressJWT({secret: JWT_KEY}),
	(req,res) => {
	filename = req.body.filename.replace(/\.[^/.]+$/, "")
	filename = findUniqueFilename(filename, 0)
	csvFilePath = CSV_FILESTORE_PATH + filename + ".csv"
	jsonFilePath = JSON_FILESTORE_PATH + filename + ".json"
	csvHeader = req.body.columns
	csvData = req.body.data

	writeCSV(csvFilePath,csvHeader,csvData)
	.then(() => {
		return convCSV2JSON(csvFilePath, jsonFilePath)
	})
	.then(() => readJSONnoPos(jsonFilePath))
	.then((obj) => addPos(obj))
	.then((withPos) => writeJSONwithPos(withPos,jsonFilePath))
	.then(() => {
		res.send({
			filename: filename
		})
	})
	.catch((err) => {
		console.log(err)
		return res.sendStatus(500).json(err)
	})
})

function findUniqueFilename(filename, version) {
	const newFilename = filename + version.toString()
	const csvFilePath = CSV_FILESTORE_PATH + newFilename + ".csv"
	if(!fs.existsSync(csvFilePath)){
		return newFilename
	}
	return findUniqueFilename(filename, version+1)
}

function writeCSV(csvFilePath, csvHeader, csvData) {
	return new Promise((resolve, reject) => {
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
			return (resolve(null))
		})
		writeStream.on('error', (err) => {
			return (reject(err))
		})
	})
}

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

function readJSONnoPos(jsonFilePath) {
	return new Promise((resolve,reject) => {
		try {
			let data = fs.readFileSync(jsonFilePath, 'utf8')
			data = JSON.parse(data)
			return resolve(data)
		} catch(err) {
			return reject(err)
		}
	})
}

function addPos(obj) {
	return new Promise((resolve, reject) => {
		const geocodePromises = obj.map(_geocodeAddressPos)
		Promise
			.all(geocodePromises)
			.then(() => resolve(obj))
			.catch((err) => reject(err))
	})
}

function writeJSONwithPos(withPos, jsonFilePath) {
	return new Promise((resolve,reject) => {
		fs.writeFile(
			jsonFilePath,
			JSON.stringify(withPos),
			'utf8',
			(err) => {
				if(err){reject(err)} 
				console.log("saved JSON with Pos")
				resolve("writeFile fin")
			}
		)
	})
}

app.get('/api/get_file_list', 
	expressJWT({secret: JWT_KEY}),
	(req,res) => {
	//return array of filenames in filestore/
	fs.readdir(JSON_FILESTORE_PATH, (err, files) => {
		if(err){
			throw(err)
			res.sendStatus(500).json(err)
		}
		//return 3 most recent
		files.sort(function(a, b) {
               return fs.statSync(JSON_FILESTORE_PATH + b).mtime.getTime() - 
                      fs.statSync(JSON_FILESTORE_PATH + a).mtime.getTime();
           });
		res.send({
			fileList: files.slice(0,3).map((file) => {return file.replace(/\.[^/.]+$/, "")})
		})
	})
})

app.post('/api/get_file', 
	expressJWT({secret: JWT_KEY}),
	(req,res) => {
	filename = req.body.filename
	filePath = JSON_FILESTORE_PATH + filename + ".json"
	console.log(filePath)
	fs.createReadStream(filePath)
		.pipe(res)
})

app.post('/api/sign_jwt', (req,res) => {
	if(req.body.username){
		username = req.body.username
		key = JWT_KEY
		token = jwt.sign({username: username},key)
		res.status(200).send(token)
	} 
	else{
		res.status(500).send('ERROR')
	}
})

app.post('/api/verify_jwt', 
	expressJWT({secret: JWT_KEY}),
	(req,res) => {
		res.sendStatus(200);
})

