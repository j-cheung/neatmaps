const express = require('express')
const app = express()
const port = process.env.PORT || 5000

app.listen(port, () => console.log('Listening on port ' + port))

const bodyParser = require('body-parser')
app.use(bodyParser.json())
app.use(express.json())
app.post('/express_backend', (req,res) => {
	console.log(req.body)
	filename = "filestore/" + req.body.filename + ".csv"
	csvData = req.body.data
	const fs = require('fs')
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
	res.send({express: 'YOUR EXPRESS BACKEND IS CONNECTED TO REACT'})
})