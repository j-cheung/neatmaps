const express = require('express')
const fs = require('fs')
const app = express()
const port = process.env.PORT || 5000
const FILESTORE_PATH = "filestore/"

app.listen(port, () => console.log('Listening on port ' + port))

const bodyParser = require('body-parser')
app.use(bodyParser.json())
app.use(express.json())
app.post('/api/upload_csv', (req,res) => {
	filename = "file" + ".csv"
	filePath = FILESTORE_PATH + filename
	csvData = req.body.data
	try {
		let writeStream = fs.createWriteStream(filename)
		csvData.forEach((row) => {
			const rowString = row.join(',') + '\n'
			writeStream.write(rowString)
		})
		writeStream.end();
	} catch(err) {
		return res.sendStatus(500).json(err)
	} 
	res.send({
		filename: filename
	})
})

app.get('/api/get_file_list', (req,res) => {
	console.log("getting file list")
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

const csv2json = require('csv2json')
app.post('/api/get_file', (req,res) => {
	filename = req.body.filename
	filePath = FILESTORE_PATH + filename
	fs.createReadStream(filePath)
		.pipe(csv2json())
		.pipe(res)
})