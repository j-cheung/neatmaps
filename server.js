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
