const mongoose = require('mongoose')
const express = require('express')
const dotenv = require('dotenv')
const commonRoute = require("./routes/common_route")
const cors = require('cors');

dotenv.config();

mongoose.set('strictQuery', false);
var app = express()

const connect = async () => {
	try {
		await mongoose.connect(process.env.DB_CONNECT);
		console.log("db connected")
	}
	catch (error) {
		console.log(err);
	}
}

app.use(cors());

app.use("/api/", commonRoute)

app.listen(4000, () => {
	connect()
	console.log('server started')
})